// app/api/post/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor");
  const userId = searchParams.get("userId");
  const limit = 10;

  if (!userId) {
      return NextResponse.json(
        { error: "Falta identificador" },
        { status: 400 }
      );
    }

  const posts = await prisma.post.findMany({
    take: limit + 1,
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    where: { userId: { not: userId } },
    cursor: cursor ? { id: cursor } : undefined,
    skip: cursor ? 1 : 0,
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
  const slicedPosts = hasMore ? posts.slice(0, -1) : posts;

  return NextResponse.json({
    posts: slicedPosts,
    nextCursor: hasMore ? slicedPosts[slicedPosts.length - 1].createdAt : null,
  });
}

export async function POST(req: Request) {
  const { title, description, url, type, email } = await req.json();

  if (!url || !type) {
    return NextResponse.json({ error: "Missing url or type" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const post = await prisma.post.create({
    data: {
      mediaUrl: url,
      mediaType: type,
      title,
      description,
      userId: user.id,
    },
  });

  return NextResponse.json({ post });
}

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get("id");
  const userId = searchParams.get("userId");

  if (!postId) {
    return NextResponse.json({ error: "Missing post ID" }, { status: 400 });
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post || post.userId !== userId) {
      return NextResponse.json(
        { error: "Not found or forbidden" },
        { status: 404 }
      );
    }

    if (post.mediaUrl){
      // Extraer public_id de la URL de Cloudinary
      const urlParts = post.mediaUrl.split("/");
      const publicIdWithExtension = urlParts[urlParts.length - 1];
      const publicId = publicIdWithExtension.split(".")[0];

      await cloudinary.uploader.destroy(publicId, {
        resource_type: post.mediaType === "video" ? "video" : "image",
      });
    }
    

    await prisma.post.delete({
      where: { id: postId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
