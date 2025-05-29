"use client";

import { User } from "next-auth";

interface UserInfoProps {
  user: User;
}

export default function UserInfo({ user }: UserInfoProps) {
  return (
    <section className=" max-w-2xl mx-auto mb-6 mt-14 text-center">
      <h2 className="text-2xl font-semibold text-purple-700">{user.name}</h2>
      <p className="text-gray-600">{user.email}</p>
    </section>
  );
}
