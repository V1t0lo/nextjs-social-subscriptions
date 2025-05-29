"use client";

import { useEffect, useRef, useState } from "react";
import { Session } from "next-auth";
import Link from "next/link";
import Image from "next/image";

interface Post {
  id: string;
  title: string;
  description: string;
  url: string;
  type: string;
  createdAt: string;
  user: {
    name: string;
  };
}

export default function Feed({ session }: { session: Session }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostRef = useRef<HTMLDivElement | null>(null);

  const fetchPosts = async (cursor?: string) => {
    setLoading(true);
    const res = await fetch(`/api/post?cursor=${cursor ?? ""}`);
    const data = await res.json();

    if (data.posts.length === 0) {
      setHasMore(false);
    } else {
      // Filtrar duplicados por ID
      setPosts((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const newPosts = data.posts.filter((p: Post) => !existingIds.has(p.id));
        return [...prev, ...newPosts];
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    if (posts.length === 0) {
      setPosts([]); // solo si está vacío
      setHasMore(true);
      fetchPosts();
    }
  }, [posts.length]);

  useEffect(() => {
    if (loading || !hasMore) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const last = posts[posts.length - 1];
        fetchPosts(last?.createdAt);
      }
    });

    if (lastPostRef.current) {
      observer.current.observe(lastPostRef.current);
    }
  }, [posts, loading, hasMore]);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Barra superior */}
      <header className="flex justify-between items-center p-4 bg-white shadow">
        <h1 className="text-xl font-bold text-purple-700">Feed</h1>
        <div className="text-sm text-gray-600">
          <Link href="/profile" className="hover:underline">
            {session.user.name}
          </Link>
        </div>
      </header>

      {/* Feed en cascada */}
      <section className="max-w-2xl mx-auto p-4 space-y-6">
        {posts.map((post, idx) => {
          const isLast = idx === posts.length - 1;
          return (
            <div
              key={post.id}
              ref={isLast ? lastPostRef : null}
              className="bg-white shadow rounded-xl border border-gray-200 p-4 space-y-2"
            >
              <div className="text-sm text-gray-500">
                {post.user.name} – {new Date(post.createdAt).toLocaleString()}
              </div>
              <h2 className="text-lg font-semibold text-gray-800 break-words">
                {post.title}
              </h2>
              <p className="text-gray-700 break-words">{post.description}</p>

              {post.type === "image" ? (
                <Image
                  src={post.url}
                  alt={post.title}
                  width={600}
                  height={400}
                  className="rounded"
                />
              ) : (
                <video
                  src={post.url}
                  controls
                  className="w-full max-h-96 rounded"
                />
              )}
              <div className="flex gap-4 text-purple-600 text-sm mt-2">
                <button className="hover:underline">👍 Like</button>
                <button className="hover:underline">💬 Comment</button>
                <button className="hover:underline">🔗 Share</button>
              </div>
            </div>
          );
        })}
        {loading && (
          <p className="text-center text-gray-500">Cargando más...</p>
        )}
        {!hasMore && posts.length > 0 && (
          <p className="text-center text-gray-400">No hay más publicaciones.</p>
        )}
      </section>
    </main>
  );
}
