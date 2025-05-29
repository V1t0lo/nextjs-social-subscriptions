"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!formData.email.includes("@")) newErrors.email = "Email inválido";
    if (formData.password.length < 6)
      newErrors.password = "Mínimo 6 caracteres";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) return setErrors(newErrors);

    const res = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    //TODO: Cambiar manejo de respuesta y solicitud, agregar loading.. y anadir mensaje de error principal arriba del boton

    if (!res?.ok) {
      setMessage("Credenciales inválidas");
    } else {
      setMessage("Usuario registrado.");
      setErrors({ email: "", password: "" }); // limpiar errores
      router.push("/feed");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white text-gray-900 p-8 rounded-xl shadow-lg w-full max-w-sm space-y-5 border border-purple-200"
      >
        <h1 className="text-2xl font-bold text-purple-700 text-center">
          Iniciar sesión
        </h1>

        <div>
          <input
            name="email"
            type="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {errors.email && (
            <p className="text-sm text-red-600 mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {errors.password && (
            <p className="text-sm text-red-600 mt-1">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white p-3 rounded hover:bg-purple-700 transition font-semibold"
        >
          Entrar
        </button>

        {message && (
          <p className="text-center text-sm text-purple-700 font-medium">
            {message}
          </p>
        )}

        <p className="text-sm text-center text-gray-600">
          ¿No tienes cuenta?{" "}
          <button
            type="button"
            onClick={() => router.push("/auth/register")}
            className="text-purple-700 hover:underline"
          >
            Regístrate
          </button>
        </p>
      </form>
    </main>
  );
}
