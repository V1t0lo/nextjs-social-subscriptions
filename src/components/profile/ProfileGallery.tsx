"use client";

import Image from "next/image";
import { Post } from "@/types/index";
import { useCallback, useEffect, useRef, useState } from "react";

interface Props {
  userId: string;
  isOwnProfile: boolean;
  refreshTrigger: number;
  onPostClick: (post: Post) => void;
}

export default function ProfileGallery({
  userId,
  isOwnProfile,
  refreshTrigger,
  onPostClick,
}: Props) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef<IntersectionObserver | null>(null);

  const lastPostRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || !hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          loadMorePosts();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const loadMorePosts = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/post/user?userId=${userId}&cursor=${cursor || ""}&limit=10`
      );
      const data = await res.json();
      setPosts((prev) => [...prev, ...data.posts]);
      setCursor(data.nextCursor);
      setHasMore(!!data.nextCursor);
    } catch (error) {
      console.error("Error loading more posts:", error);
    }
    setLoading(false);
  };

  const reloadInitialPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/post/user?userId=${userId}&cursor=&limit=10`
      );
      const data = await res.json();
      setPosts(data.posts);
      setCursor(data.nextCursor);
      setHasMore(!!data.nextCursor);
    } catch (error) {
      console.error("Error reloading posts:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    reloadInitialPosts();
  }, [refreshTrigger]);

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-700 mb-4">
        {isOwnProfile ? "Tus publicaciones" : "Publicaciones"}
      </h3>
      {posts.length === 0 ? (
        <p className="text-gray-500">Aún no has subido publicaciones.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {posts.map((post, index) => {
            const ref = index === posts.length - 1 ? lastPostRef : null;
            return (
              <div
                key={post.id}
                ref={ref}
                className="cursor-pointer hover:shadow-md transition"
                onClick={() => onPostClick(post)}
              >
                {post.mediaType === "image" ? (
                  <Image
                    src={post.mediaUrl}
                    alt={post.title}
                    width={400}
                    height={300}
                    className="rounded w-full h-48 object-cover"
                  />
                ) : (
                  <video
                    src={post.mediaUrl}
                    className="w-full h-48 object-cover rounded"
                    muted
                    preload="metadata"
                    onLoadedMetadata={(e) => {
                      (e.target as HTMLVideoElement).currentTime = 0.1;
                    }}
                  />
                )}
                <p className="mt-2 text-sm text-purple-700 font-medium truncate">
                  {post.title}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
