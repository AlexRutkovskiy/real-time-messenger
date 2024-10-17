import bcrypt from "bcrypt"

import prisma from "@/app/libs/prismadb"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const {name, email, password} = await request.json();
    if (!name || !email || !password) {
      return new NextResponse('Missing info', {status: 400})
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword
      }
    });

    return NextResponse.json(user)
  } catch(e) {
    console.log("Registration error", e)
    return new NextResponse("Internal Error", {status: 500})
  }
}