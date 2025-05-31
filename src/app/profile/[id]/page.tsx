import { notFound } from "next/navigation";
import StickyHeader from "@/components/layout/StickyHeader";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ProfileContent from "@/components/profile/ProfileContent";
import UserInfo from "@/components/profile/UserInfo";

interface ProfilePageProps {
  params: { id: string };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const res = await fetch(`/api/post/user?userId=${params.id}`);
  const user = res.json();

  if (!user) return notFound();

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
      <UserInfo user={user} />
      <ProfileContent userId={user.id} />
    </main>
  );
}
