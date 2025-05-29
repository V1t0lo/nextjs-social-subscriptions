// app/feed/page.tsx
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Feed from "../../components/FeedClient"; // Componente cliente que mostraría los posts

export default async function FeedPage() {
  const session: Session | null = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  return <Feed session={session} />;
}
