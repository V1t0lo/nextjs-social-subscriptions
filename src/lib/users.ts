import { prisma } from "@/lib/prisma";
import { PublicUser } from "@/types";

export async function getUserById(id: string): Promise<PublicUser | null> {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      //image: true,
      followers: {
        select: {
          followerId: true, // Quién lo sigue
        },
      },
      subscribers: {
        select: {
          subscriberId: true, // Quién está suscrito
        },
      },
    },
  });

  if (!user) return null;

  return {
    ...user,
    followerCount: user.followers.length,
    subscriberCount: user.subscribers.length,
  };
}
