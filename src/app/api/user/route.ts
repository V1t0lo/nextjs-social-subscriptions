// src/app/api/user/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserById } from "@/lib/users";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Falta identificador" },
        { status: 400 }
      );
    }

    const user = await getUserById(userId);

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener perfil" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  const { name, email } = await req.json();

  try {
    await prisma.user.update({
      where: { email: email },
      data: { name },
    });

    return NextResponse.json({ message: "Nombre actualizado" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error al actualizar el nombre" },
      { status: 500 }
    );
  }
}
