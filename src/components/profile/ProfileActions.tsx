// components/profile/ProfileActions.tsx
"use client";

import { signOut } from "next-auth/react";
import { LogOut, Settings } from "lucide-react";
import Link from "next/link";

export default function ProfileActions() {
  return (
    <div className="flex items-center gap-4">
      <Link
        href="/profile/settings"
        title="Ajustes"
        className="text-purple-600 hover:text-purple-800"
      >
        <Settings />
      </Link>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        title="Cerrar sesión"
        className="text-red-500 hover:text-purple-900"
      >
        <LogOut />
      </button>
    </div>
  );
}
