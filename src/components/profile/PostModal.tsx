"use client";

import Image from "next/image";
import { Post } from "@/types/index";

interface Props {
  post?: Post | null;
  onClose: () => void;
  onDelete: () => void;
}

export default function PostModal({ post, onClose, onDelete }: Props) {
  if (!post) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative max-w-2xl w-full max-h-[90vh] bg-white rounded-xl shadow-lg overflow-auto p-6">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
        >
          ✖
        </button>

        <h2 className="text-xl font-bold text-purple-700 mb-2 break-words">
          {post.title}
        </h2>
        <p className="text-gray-600 mb-4 break-words">{post.description}</p>

        {post.mediaType === "image" ? (
          <Image
            src={post.mediaUrl}
            alt={post.title}
            width={600}
            height={400}
            className="rounded mb-4 max-w-full"
          />
        ) : (
          <video
            src={post.mediaUrl}
            controls
            className="w-full max-h-[60vh] rounded mb-4"
          />
        )}

        <button
          onClick={onDelete}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Eliminar publicación
        </button>
      </div>
    </div>
  );
}
