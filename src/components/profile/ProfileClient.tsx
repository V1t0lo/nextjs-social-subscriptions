"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Settings, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";

interface Post {
  id: string;
  title: string;
  description: string;
  url: string;
  type: string; // 'image' | 'video'
}

type Props = {
  session: Session;
};

export default function ProfilePage({ session }: Props) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);

  const [focusedField, setFocusedField] = useState<
    "title" | "description" | null
  >(null);
  const [open, setOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch("/api/user");

      if (!res.ok) return router.push("/auth/login");

      const data = await res.json();

      setName(data.name || "");
      setEmail(data.email || "");
      setPosts(data.posts || []);
    };

    fetchProfile();
  }, [session, router]);

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    // Validaciones de campos
    if (title.trim().length < 3 || title.length > 100) {
      return alert("El título debe tener entre 3 y 100 caracteres.");
    }

    if (description.trim().length < 10 || description.length > 500) {
      return alert("La descripción debe tener entre 10 y 500 caracteres.");
    }

    if (!mediaFile) {
      return alert("Debes seleccionar una imagen o video.");
    }

    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "video/mp4",
      "video/webm",
      "video/x-matroska",
    ];
    if (!validTypes.includes(mediaFile.type)) {
      return alert("Tipo de archivo no permitido.");
    }

    const maxSizeMB = 50;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (mediaFile.size > maxSizeBytes) {
      return alert(`El archivo debe pesar menos de ${maxSizeMB}MB.`);
    }
    // Fin validaciones
    const isVideo = mediaFile.type.startsWith("video");

    const formData = new FormData();
    formData.append("file", mediaFile);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    );

    const uploadUrl = `https://api.cloudinary.com/v1_1/${
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    }/${isVideo ? "video" : "image"}/upload`;

    const cloudRes = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });

    const cloudData = await cloudRes.json();

    const transformedUrl = isVideo
      ? cloudData.secure_url.replace("/upload/", "/upload/f_mp4/")
      : cloudData.secure_url;

    const postRes = await fetch("/api/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        url: transformedUrl,
        type: isVideo ? "video" : "image",
      }),
    });

    const newPostData = await postRes.json();
    setPosts((prev) => [newPostData.post, ...prev]);
    setTitle("");
    setDescription("");
    setMediaFile(null);
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Barra superior */}
      <header className="flex justify-between items-center p-4 bg-white shadow">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/feed")}
            className="text-purple-600 hover:text-purple-800 transition"
          >
            <ArrowLeft />
          </button>
          <h1 className="text-xl font-bold text-purple-700">Tu perfil</h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/profile/settings")}
            className="text-purple-600 hover:text-purple-800 transition"
            title="Ajustes"
          >
            <Settings />
          </button>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-red-500 hover:text-red-700 transition"
            title="Cerrar sesión"
          >
            <LogOut />
          </button>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Info del usuario */}
        <div className="bg-white rounded-xl shadow p-6 border border-purple-100">
          <h2 className="text-2xl font-bold text-purple-700">{name}</h2>
          <p className="text-sm text-gray-500">{email}</p>
        </div>

        {/* Formulario de subida */}
        <div className="bg-white rounded-xl shadow border border-gray-200">
          <button
            onClick={() => setOpen(!open)}
            className="w-full text-left px-6 py-4 text-purple-700 hover:text-purple-900 flex items-center justify-between"
          >
            <span className="text-lg font-semibold">Nueva publicación</span>
            <span
              className="transform transition-transform"
              style={{ transform: open ? "rotate(180deg)" : "none" }}
            >
              ▼
            </span>
          </button>

          {open && (
            <form
              onSubmit={handleUpload}
              className="px-6 pb-6 space-y-4 transition-all duration-300 ease-in-out"
            >
              <input
                type="text"
                placeholder="Título"
                value={title}
                onChange={(e) => {
                  if (e.target.value.length <= 100) setTitle(e.target.value);
                }}
                onFocus={() => setFocusedField("title")}
                onBlur={() => setFocusedField(null)}
                className="w-full p-3 border rounded border-purple-300"
                required
              />
              {focusedField === "title" && (
                <p className="text-xs text-gray-500 text-right">
                  {100 - title.length} caracteres restantes
                </p>
              )}

              <textarea
                placeholder="Descripción"
                value={description}
                onChange={(e) => {
                  if (e.target.value.length <= 300)
                    setDescription(e.target.value);
                }}
                onFocus={() => setFocusedField("description")}
                onBlur={() => setFocusedField(null)}
                className="w-full p-3 border rounded border-purple-300"
                required
              />
              {focusedField === "description" && (
                <p className="text-xs text-gray-500 text-right">
                  {300 - description.length} caracteres restantes
                </p>
              )}

              <input
                type="file"
                accept="image/*,video/mp4,video/webm,video/x-matroska"
                onChange={(e) => setMediaFile(e.target.files?.[0] || null)}
                required
              />

              <button
                type="submit"
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition w-full"
              >
                Subir publicación
              </button>
            </form>
          )}
        </div>

        {/* Galería con portada y título */}
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
                  onClick={() => setSelectedPost(post)}
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
                        // Solo muestra la portada inicial del video sin reproducción automática
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

        {selectedPost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="relative max-w-2xl w-full max-h-[90vh] bg-white rounded-xl shadow-lg overflow-auto p-6">
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
              >
                ✖
              </button>

              <h2 className="text-xl font-bold text-purple-700 mb-2 break-words">
                {selectedPost.title}
              </h2>
              <p className="text-gray-600 mb-4 break-words">
                {selectedPost.description}
              </p>

              {selectedPost.type === "image" ? (
                <Image
                  src={selectedPost.url}
                  alt={selectedPost.title}
                  width={600}
                  height={400}
                  className="rounded mb-4 max-w-full"
                />
              ) : (
                <video
                  src={selectedPost.url}
                  controls
                  className="w-full max-h-[60vh] rounded mb-4"
                />
              )}

              <button
                onClick={async () => {
                  const res = await fetch(`/api/post?id=${selectedPost.id}`, {
                    method: "DELETE",
                  });

                  if (res.ok) {
                    setPosts((prev) =>
                      prev.filter((p) => p.id !== selectedPost.id)
                    );
                    setSelectedPost(null);
                  } else {
                    alert("Error al eliminar el post.");
                  }
                }}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Eliminar publicación
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
