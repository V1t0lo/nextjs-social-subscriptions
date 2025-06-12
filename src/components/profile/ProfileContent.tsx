// components/profile/ProfileContent.tsx
"use client";

import { useState } from "react";
import PostUploadForm from "./PostUploadForm";
import ProfileGallery from "./ProfileGallery";
import PostModal from "./PostModal";
import { Post } from "@/types";

interface ProfileContentProps {
  userId: string;
}

export default function ProfileContent({ userId }: ProfileContentProps) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1); // cambia el valor para activar useEffect
  };

  const handlePostClick = (post: Post) => setSelectedPost(post);
  const handleCloseModal = () => setSelectedPost(null);

  const handlePostCreated = () => {
    triggerRefresh();
  };

  const handleDeletePost = async () => {
    const res = await fetch(`/api/post?id=${selectedPost?.id}&userId=${userId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      triggerRefresh(); // actualiza la galería tras eliminar
      setSelectedPost(null);
    } else {
      alert("Error al eliminar el post.");
    }
  };

  return (
    <section className="max-w-7xl mx-auto">
      <PostUploadForm 
        userId={userId} 
        onPostCreated={handlePostCreated} 
      />
      <ProfileGallery
        userId={userId}
        refreshTrigger={refreshTrigger}
        onPostClick={handlePostClick}
      />
      <PostModal
        post={selectedPost || undefined}
        onClose={handleCloseModal}
        onDelete={handleDeletePost}
      />
    </section>
  );
}
