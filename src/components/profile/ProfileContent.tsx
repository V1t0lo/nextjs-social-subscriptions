// components/profile/ProfileContent.tsx
"use client";

import { useEffect, useState } from "react";
import PostUploadForm from "./PostUploadForm";
import ProfileGallery from "./ProfileGallery";
import PostModal from "./PostModal";
import { Post } from "@/types";

export default function ProfileContent() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("/api/user");
      const data = await res.json();
      setPosts(data.posts || []);
    };
    fetchPosts();
  }, [posts]);

  const handlePostCreated = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
  };

  const handleDeletePost = async () => {
    const res = await fetch(`/api/post?id=${selectedPost?.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setPosts((prev) => prev.filter((post) => post.id !== selectedPost?.id));
      setSelectedPost(null);
    } else alert("Error al eliminar el post.");
  };

  return (
    <section className="max-w-7xl mx-auto">
      <PostUploadForm onPostCreated={handlePostCreated} />
      <ProfileGallery posts={posts} onPostClick={handlePostClick} />
      <PostModal
        post={selectedPost || undefined}
        onClose={handleCloseModal}
        onDelete={handleDeletePost}
      />
    </section>
  );
}
