import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { currentUserId, targetUserId } = await req.json();

    if (!currentUserId || !targetUserId || currentUserId === targetUserId) {
      return NextResponse.json(
        { error: "Parámetros inválidos" },
        { status: 400 }
      );
    }

    await prisma.follow.create({
      data: {
        followerId: currentUserId,
        followedId: targetUserId,
      },
    });

    const followerCount = await prisma.follow.count({
      where: { followedId: targetUserId },
    });
    return NextResponse.json({ followerCount });
  } catch (error) {
    console.error("Error al seguir usuario:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { currentUserId, targetUserId } = await req.json();

    if (!currentUserId || !targetUserId || currentUserId === targetUserId) {
      return NextResponse.json(
        { error: "Parámetros inválidos" },
        { status: 400 }
      );
    }

    await prisma.follow.delete({
      where: {
        followerId_followedId: {
          followerId: currentUserId,
          followedId: targetUserId,
        },
      },
    });

    const followerCount = await prisma.follow.count({
      where: { followedId: targetUserId },
    });
    return NextResponse.json({ followerCount });
  } catch (error) {
    console.error("Error al dejar de seguir usuario:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
