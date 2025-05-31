"use client";

import Image from "next/image";
import { useState, FormEvent, useEffect } from "react";

interface Props {
  onPostCreated: () => void;
}

export default function PostUploadForm({ onPostCreated }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const [focusedField, setFocusedField] = useState<
    "title" | "description" | null
  >(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!mediaFile) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(mediaFile);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [mediaFile]);

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();

    if (title.trim().length < 3 || title.length > 100) {
      return alert("El título debe tener entre 3 y 100 caracteres.");
    }

    if (description.trim().length < 10 || description.length > 500) {
      return alert("La descripción debe tener entre 10 y 500 caracteres.");
    }

    if (!mediaFile) return alert("Debes seleccionar una imagen o video.");

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
    if (mediaFile.size > maxSizeMB * 1024 * 1024) {
      return alert(`El archivo debe pesar menos de ${maxSizeMB}MB.`);
    }

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

    const cloudRes = await fetch(uploadUrl, { method: "POST", body: formData });
    const cloudData = await cloudRes.json();
    const url = isVideo
      ? cloudData.secure_url.replace("/upload/", "/upload/f_mp4/")
      : cloudData.secure_url;

    const res = await fetch("/api/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        url,
        type: isVideo ? "video" : "image",
      }),
    });

    const data = await res.json();

    if (!data.error) {
      onPostCreated();
      setTitle("");
      setDescription("");
      setMediaFile(null);
      setPreviewUrl(null);
      setOpen(false);
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 mb-4">
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
          {/* Título */}
          <div>
            <input
              type="text"
              placeholder="Título"
              value={title}
              onChange={(e) =>
                e.target.value.length <= 100 && setTitle(e.target.value)
              }
              onFocus={() => setFocusedField("title")}
              onBlur={() => setFocusedField(null)}
              className="w-full p-3 border rounded border-purple-300"
              required
            />
            <div className="h-4">
              {focusedField === "title" && (
                <p className="text-xs text-gray-500 text-right">
                  {100 - title.length} caracteres restantes
                </p>
              )}
            </div>
          </div>

          {/* Descripción */}
          <div>
            <textarea
              placeholder="Descripción"
              value={description}
              onChange={(e) =>
                e.target.value.length <= 300 && setDescription(e.target.value)
              }
              onFocus={() => setFocusedField("description")}
              onBlur={() => setFocusedField(null)}
              className="w-full p-3 border rounded border-purple-300"
              required
            />
            <div className="h-4">
              {focusedField === "description" && (
                <p className="text-xs text-gray-500 text-right">
                  {300 - description.length} caracteres restantes
                </p>
              )}
            </div>
          </div>

          {/* Archivo */}
          <input
            type="file"
            accept="image/*,video/mp4,video/webm,video/x-matroska"
            onChange={(e) => setMediaFile(e.target.files?.[0] || null)}
            required
          />

          {/* Previsualización */}
          {previewUrl && (
            <div className="mt-2 rounded overflow-hidden border border-gray-200">
              {mediaFile?.type.startsWith("image") ? (
                <Image
                  src={previewUrl}
                  alt="Previsualización"
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <video
                  src={previewUrl}
                  className="w-full h-48 object-cover"
                  controls
                  muted
                />
              )}
            </div>
          )}

          {/* Botón de envío */}
          <button
            type="submit"
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition w-full"
          >
            Subir publicación
          </button>
        </form>
      )}
    </div>
  );
}
