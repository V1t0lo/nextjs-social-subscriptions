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

    await prisma.subscription.create({
      data: {
        subscriberId: currentUserId,
        subscribedToId: targetUserId,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días desde ahora
      },
    });

    const subscriberCount = await prisma.subscription.count({
      where: { subscribedToId: targetUserId },
    });
    return NextResponse.json({ subscriberCount });
  } catch (error) {
    console.error("Error al suscribirse al usuario:", error);
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

    await prisma.subscription.delete({
      where: {
        subscriberId_subscribedToId: {
          subscriberId: currentUserId,
          subscribedToId: targetUserId,
        },
      },
    });

    const subscriberCount = await prisma.subscription.count({
      where: { subscribedToId: targetUserId },
    });
    return NextResponse.json({ subscriberCount });
  } catch (error) {
    console.error("Error al cancelar suscripción:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
