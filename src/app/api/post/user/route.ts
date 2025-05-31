import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const cursor = searchParams.get("cursor");
  const limit = parseInt(searchParams.get("limit") || "10");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const posts = await prisma.post.findMany({
      where: { userId },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: limit + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const hasMore = posts.length > limit;
    const slicedPosts = hasMore ? posts.slice(0, -1) : posts;

    return NextResponse.json({
      posts: slicedPosts,
      nextCursor: hasMore ? slicedPosts[slicedPosts.length - 1].id : null,
    });
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
