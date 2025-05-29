import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import StickyHeader from "@/components/layout/StickyHeader";
import { ArrowLeft } from "lucide-react";

import ProfileContent from "@/components/profile/ProfileContent";
import ProfileActions from "@/components/profile/ProfileActions";
import Link from "next/link";
import UserInfo from "@/components/profile/UserInfo";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    console.log("No se ha encontrado sesión activa");
    redirect("/auth/login");
  }

  const { user } = session;

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
      <UserInfo user={user} />

      {/* Contenido interactivo del perfil */}
      <ProfileContent />
    </main>
  );
}
