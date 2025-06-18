"use client";

import { PublicUser } from "@/types/index";
import Image from "next/image";
import { useState } from "react";
import ToggleActionButton from "../layout/ToggleActionButton";

interface UserInfoProps {
  user: PublicUser;
  isOwnProfile: boolean;
  currentUserId?: string | null;
  isFollowing?: boolean | null;
  isSubscribed?: boolean | null;
}

export default function UserInfo({
  user,
  isOwnProfile,
  currentUserId,
  isFollowing,
  isSubscribed,
}: UserInfoProps) {
  const [userState, setUserState] = useState(user);
  const [isFollowingState, setIsFollowingState] = useState(
    isFollowing ?? false
  );
  const [isSubscribedState, setIsSubscribedState] = useState(
    isSubscribed ?? false
  );

  const onFollowToggle = async (newState: boolean) => {
    try {
      const res = await fetch("/api/follow", {
        method: newState ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentUserId: currentUserId,
          targetUserId: user.id,
        }),
      });

      if (!res.ok) throw new Error("Error al cambiar el estado de seguimiento");

      const data = await res.json();
      setUserState((prev) => ({
        ...prev,
        followerCount: data.followerCount,
      }));
      setIsFollowingState(newState);

      return true;
    } catch (error) {
      console.error("Error al seguir/dejar de seguir:", error);
      return false;
    }
  };

  const onSubscribeToggle = async (newState: boolean) => {
    try {
      const res = await fetch("/api/subscribe", {
        method: newState ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentUserId: currentUserId,
          targetUserId: user.id,
        }),
      });

      if (!res.ok) throw new Error("Error al cambiar el estado de suscripción");

      const data = await res.json();
      setUserState((prev) => ({
        ...prev,
        subscriberCount: data.subscriberCount,
      }));
      setIsSubscribedState(newState);

      return true;
    } catch (error) {
      console.error("Error al suscribirse/desuscribirse:", error);
      return false;
    }
  };

  const onMessageButton = async () => {
    alert("msj");
  };

  return (
    <section className="max-w-2xl mx-auto mt-14 mb-8 text-center space-y-3">
      {/* Imagen de perfil */}
      <div className="w-24 h-24 mx-auto relative rounded-full overflow-hidden border shadow">
        <Image
          src={/*user.image ??*/ "/default-avatar.jpg"}
          alt={userState.name ?? ""}
          fill
          className="object-cover"
        />
      </div>

      {/* Nombre y usuario */}
      <h2 className="text-2xl font-bold text-purple-700">{userState.name}</h2>
      {/*<p className="text-gray-600 text-sm">@{user.username}</p>*/}
      <p className="text-gray-500 text-sm">{userState.email}</p>

      {/* Suscriptores */}
      {typeof userState.subscriberCount === "number" && (
        <p className="text-sm text-muted-foreground">
          {userState.subscriberCount}{" "}
          {userState.subscriberCount === 1 ? "suscriptor" : "suscriptores"}
        </p>
      )}
      {/* Seguidores */}
      {typeof userState.followerCount === "number" && (
        <p className="text-sm text-muted-foreground">
          {userState.followerCount}{" "}
          {userState.followerCount === 1 ? "seguidor" : "seguidores"}
        </p>
      )}

      {/* Botónes de acción */}
      <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
        {!isOwnProfile && (
          <ToggleActionButton
            active={isSubscribedState}
            onToggleAction={onSubscribeToggle}
            activeText="Anular suscripción"
            inactiveText="Suscribirse"
          />
        )}
        {!isOwnProfile && (
          <ToggleActionButton
            active={isFollowingState}
            onToggleAction={onFollowToggle}
            activeText="Siguiendo"
            inactiveText="Seguir"
          />
        )}

        {!isOwnProfile && onMessageButton && (
          <button
            onClick={onMessageButton}
            className="px-4 py-2 rounded-full border text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            Enviar mensaje
          </button>
        )}
      </div>
    </section>
  );
}
