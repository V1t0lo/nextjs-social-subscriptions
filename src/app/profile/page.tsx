import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import StickyHeader from "@/components/layout/StickyHeader";
import { ArrowLeft } from "lucide-react";

import ProfileContent from "@/components/profile/ProfileContent";
import ProfileActions from "@/components/profile/ProfileActions";
import Link from "next/link";
import UserInfo from "@/components/profile/UserInfo";
import { getUserById } from "@/lib/users";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    console.log("No se ha encontrado sesión activa");
    redirect("/auth/login");
  }

  const user = await getUserById(session.user.id);

  if (!user) return notFound();

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 px-4 py-6">
      {/* Encabezado fijo */}
      <StickyHeader
        title="Tu perfil"
        leftButton={
          <Link href="/feed" className="text-purple-600 hover:text-purple-800">
            <ArrowLeft />
          </Link>
        }
        rightButtons={[<ProfileActions key="actions" />]}
      />

      {/* Información del usuario */}
      <UserInfo user={user} isOwnProfile={true} />

      {/* Contenido interactivo del perfil */}
      <ProfileContent userId={user.id} isOwnProfile={true} />
    </main>
  );
}
