import { prisma } from "./prisma";

export async function isFollowing(followerId: string, followedId: string) {
  return await prisma.follow.findUnique({
    where: {
      followerId_followedId: { followerId, followedId },
    },
  });
}

export async function isSubscribed(
  subscriberId: string,
  subscribedToId: string
) {
  return await prisma.subscription.findUnique({
    where: {
      subscriberId_subscribedToId: { subscriberId, subscribedToId },
    },
  });
}
