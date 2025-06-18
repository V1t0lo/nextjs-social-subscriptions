import { notFound, redirect } from "next/navigation";
import StickyHeader from "@/components/layout/StickyHeader";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ProfileContent from "@/components/profile/ProfileContent";
import UserInfo from "@/components/profile/UserInfo";
import { getUserById } from "@/lib/users";
import { isFollowing, isSubscribed } from "@/lib/follow";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface ProfilePageProps {
  params: { id: string };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    console.log("No se ha encontrado sesión activa");
    redirect("/auth/login");
  }
  const user = await getUserById(params.id);

  if (!user) return notFound();

  const isOwnProfile = session?.user?.id === user.id;

  if (isOwnProfile) {
    redirect("/profile");
  }

  const followingUser = !isOwnProfile
    ? !!(await isFollowing(session.user.id, user.id))
    : null;
  const subscribedUser = !isOwnProfile
    ? !!(await isSubscribed(session.user.id, user.id))
    : null;

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 px-4 py-6">
      <StickyHeader
        title="Perfil"
        leftButton={
          <Link href="/feed" className="text-purple-600 hover:text-purple-800">
            <ArrowLeft />
          </Link>
        }
        rightButtons={[]}
      />
      <UserInfo
        user={user}
        currentUserId={session.user.id}
        isOwnProfile={isOwnProfile}
        isFollowing={followingUser}
        isSubscribed={subscribedUser}
      />
      <ProfileContent userId={user.id} isOwnProfile={isOwnProfile} />
    </main>
  );
}
