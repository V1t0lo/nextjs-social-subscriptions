"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Session } from "next-auth";
import Link from "next/link";
import Image from "next/image";
import { Post } from "@/types/index";

export default function Feed({ session }: { session: Session }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const lastPostRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || !hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && posts.length > 0) {
          const last = posts[posts.length - 1];
          fetchPosts({
            id: last.id,
            createdAt: last.createdAt,
          });
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, posts]
  );

  const fetchPosts = async (cursor?: { id: string; createdAt: string }) => {
    if (loading || !hasMore) return;
    setLoading(true);

    const body = {
      userId: session.user.id,
      cursor,
      limit: 10,
    };

    try {
      const res = await fetch("/api/post/feed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!data.posts || data.posts.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const newPosts = data.posts.filter(
            (p: Post) => !existingIds.has(p.id)
          );
          return [...prev, ...newPosts];
        });

        if (!data.nextCursor) {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    setPosts([]);
    setHasMore(true);
    fetchPosts();
  }, [session.user.id]);

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="flex justify-between items-center p-4 bg-white shadow">
        <h1 className="text-xl font-bold text-purple-700">Feed</h1>
        <div className="text-sm text-gray-600">
          <Link href="/profile" className="hover:underline">
            {session.user.name}
          </Link>
        </div>
      </header>

      <section className="max-w-2xl mx-auto p-4 space-y-6">
        {posts.map((post, idx) => {
          const isLast = idx === posts.length - 1;
          return (
            <div
              key={post.id}
              ref={isLast ? lastPostRef : null}
              className="bg-white shadow rounded-xl border border-gray-200 p-4 space-y-2"
            >
              <div className="flex justify-between items-center text-sm text-gray-500">
                <Link
                  href={`/profile/${post.user.id}`}
                  className="text-purple-600 hover:underline font-medium"
                >
                  {post.user.name}
                </Link>
                <span>{new Date(post.createdAt).toLocaleString()}</span>
              </div>
              <h2 className="text-lg font-semibold text-gray-800 break-words">
                {post.title}
              </h2>
              <p className="text-gray-700 break-words">{post.description}</p>

              {post.mediaType === "image" ? (
                <Image
                  src={post.mediaUrl}
                  alt={post.title}
                  width={600}
                  height={400}
                  className="rounded"
                />
              ) : (
                <video
                  src={post.mediaUrl}
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
