import getCurrentUser from "@/app/actions/getCurrentUser"
import prisma from "@/app/libs/prismadb"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    const { name, image } = await req.json();

    if(!currentUser?.id) {
      return new NextResponse("Unautorize", { status: 401 })
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser?.id
      },
      data: {
        image: image,
        name: name
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.log(error)
    return new NextResponse("Internal error", { status: 500 })
  }
}