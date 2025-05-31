"use client";

import { User } from "next-auth";
import Image from "next/image";

interface UserInfoProps {
  user: User;
  // isOwnProfile: boolean;
  // isSubscribed?: boolean;
  // onSubscribeToggle?: () => void;
}

export default function UserInfo({
  user,
}: // isOwnProfile,
// isSubscribed,
// onSubscribeToggle,
UserInfoProps) {
  return (
    <section className="max-w-2xl mx-auto mt-14 mb-8 text-center space-y-3">
      {/* Imagen de perfil */}
      <div className="w-24 h-24 mx-auto relative rounded-full overflow-hidden border shadow">
        <Image
          src={user.image ?? "/default-avatar.jpg"}
          alt={user.name ?? ""}
          fill
          className="object-cover"
        />
      </div>

      {/* Nombre y usuario */}
      <h2 className="text-2xl font-bold text-purple-700">{user.name}</h2>
      {/*<p className="text-gray-600 text-sm">@{user.username}</p>*/}
      <p className="text-gray-500 text-sm">{user.email}</p>

      {/* Suscriptores 
      {typeof user.subscribers === "number" && (
        <p className="text-sm text-muted-foreground">
          {user.subscribers}{" "}
          {user.subscribers === 1 ? "suscriptor" : "suscriptores"}
        </p>
      )}*/}

      {/* Botón de acción 
      {!isOwnProfile && onSubscribeToggle && (
        <Button onClick={onSubscribeToggle}>
          {isSubscribed ? "Dejar de seguir" : "Seguir"}
        </Button>
      )}*/}
    </section>
  );
}
