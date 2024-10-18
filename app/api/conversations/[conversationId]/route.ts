import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";
import { PUSHER_EVENTS } from "@/app/utils/constance";
import { NextResponse } from "next/server";

interface IParams {
  conversationId?: string
}

export async function DELETE(req:Request, { params }: {params: IParams}) {
  try {
    const { conversationId } = params;
    const currentUser = await getCurrentUser()

    if(!currentUser?.id) {
      return new NextResponse('Unautorize', { status: 401 })
    }

    const existingConversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId
      },
      include: {
        users: true
      }
    })

    if(!existingConversation) {
      return new NextResponse("Invalid ID", { status: 400 })
    }

    const deleteConversation = await prisma.conversation.deleteMany({
      where: {
        id: conversationId,
        userIds: {
          hasSome: [currentUser.id]
        }
      }
    })

    existingConversation.users.forEach(user => {
      if (user.email) {
        pusherServer.trigger(user.email, PUSHER_EVENTS.CONVERSATION_REMOVE, existingConversation)
      }
    })

    return NextResponse.json(deleteConversation)
  } catch (error) {
    console.log(error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}