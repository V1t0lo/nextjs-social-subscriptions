import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  const { userId, cursor, limit = 10 } = await req.json();

  if (!userId) {
    return NextResponse.json(
      { error: "Falta identificador" },
      { status: 400 }
    );
  }

  try {
    const posts = await prisma.post.findMany({
      take: limit + 1,
      orderBy: [
        { createdAt: "desc" },
        { id: "desc" },
      ],
      where: { userId: { not: userId } },
      ...(cursor && {
        cursor: {
          createdAt_id: {
            createdAt: new Date(cursor.createdAt),
            id: cursor.id,
          },
        },
        skip: 1,
      }),
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const hasMore = posts.length > limit;
    const nextPosts = hasMore ? posts.slice(0, -1) : posts;
    const lastPost = nextPosts[nextPosts.length - 1];

    return NextResponse.json({
      posts: nextPosts,
      nextCursor: hasMore
        ? { id: lastPost.id, createdAt: lastPost.createdAt }
        : null,
    });
  } catch (error) {
    console.error("Error fetching feed posts:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}