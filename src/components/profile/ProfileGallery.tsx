"use client";

import Image from "next/image";
import { Post } from "@/types/index";

interface Props {
  posts: Post[];
  onPostClick: (post: Post) => void;
}

export default function ProfileGallery({ posts, onPostClick }: Props) {
  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-700 mb-4">
        Tus publicaciones
      </h3>
      {posts.length === 0 ? (
        <p className="text-gray-500">Aún no has subido publicaciones.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="cursor-pointer hover:shadow-md transition"
              onClick={() => onPostClick(post)}
            >
              {post.type === "image" ? (
                <Image
                  src={post.url}
                  alt={post.title}
                  width={400}
                  height={300}
                  className="rounded w-full h-48 object-cover"
                />
              ) : (
                <video
                  src={post.url}
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
          ))}
        </div>
      )}
    </div>
  );
}
