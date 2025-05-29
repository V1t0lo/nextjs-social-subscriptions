"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-10 rounded-lg shadow-md text-center space-y-6 max-w-sm w-full">
        <h1 className="text-2xl font-bold text-purple-700">Bienvenido</h1>
        <p className="text-gray-700">Accede o regístrate para comenzar</p>
        <div className="flex flex-col space-y-4">
          <button
            onClick={() => router.push("/auth/login")}
            className="bg-purple-700 text-white py-2 rounded hover:bg-purple-800 transition"
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => router.push("/auth/register")}
            className="bg-white border border-purple-700 text-purple-700 py-2 rounded hover:bg-purple-100 transition"
          >
            Registrarse
          </button>
        </div>
      </div>
    </main>
  );
}
