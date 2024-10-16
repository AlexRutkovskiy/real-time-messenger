import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { PUSHER_EVENTS } from "@/app/utils/constance";

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    const { userId, isGroup, members, name } = await req.json();

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unautorize", { status: 401 });
    }

    if (isGroup && (!members || (members as unknown[]).length < 2 || !name)) {
      return new NextResponse("Invalid data", { status: 400 })
    }

    if (isGroup) {
      const newConversation = await prisma.conversation.create({
        data: {
          name,
          isGroup,
          users: {
            connect: [
              ...members.map((member: {value: string}) => ({
                id: member.value
              })),
              {
                id: currentUser.id
              }
            ]
          }
        },
        include: {
          users: true
        }
      })

      newConversation.users.forEach(user => {
        if (user.email) {
          pusherServer.trigger(user.email, PUSHER_EVENTS.CONVERSATION_NEW, newConversation);
        }
      })

      return NextResponse.json(newConversation);
    }

    const existingConversations = await prisma.conversation.findMany({
      where: {
        OR: [
          {
            userIds: {
              equals: [currentUser.id, userId]
            }
          },
          {
            userIds: {
              equals: [userId, currentUser.id]
            }
          }
        ]
      }
    })

    const singleConversation = existingConversations[0];
    if (singleConversation) {
      return NextResponse.json(singleConversation)
    }

    const newConversation = await prisma.conversation.create({
      data: {
        users: {
          connect: [
            {
              id: currentUser.id
            },
            {
              id: userId
            }
          ]
        }
      },
      include: {
        users: true
      }
    })

    newConversation.users.forEach(user => {
      if (user.email) {
        pusherServer.trigger(user.email, PUSHER_EVENTS.CONVERSATION_NEW, newConversation);
      }
    })

    return NextResponse.json(newConversation)
  } catch (error) {
    console.log(error)
    return new NextResponse("Internal Error", { status: 500});
  }
}