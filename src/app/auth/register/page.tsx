"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import LoadingButton from "@/components/layout/LoadingButton";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = { email: "", password: "" };
    let isValid = true;

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Correo electrónico no válido";
      isValid = false;
    }

    if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!validate()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      //TODO: Cambiar manejo de respuesta y solicitud, agregar loading.. y anadir mensaje de error principal arriba del boton
  
      const data = await res.json();
      if (!res.ok) {
        if (data.error?.includes("registrado")) {
          setErrors((prev) => ({ ...prev, email: data.error }));
        } else {
          setMessage(data.error || "Error al registrar");
        }
      } else {
        setMessage("Usuario creado.");
        setErrors({ email: "", password: "" }); // limpiar errores
        const signInResult = await signIn("credentials", {
          redirect: false, // evitar redirección automática
          email: formData.email,
          password: formData.password,
        });
  
        if (signInResult?.ok) {
          router.push("/profile"); // redirigir manualmente después del login exitoso
        } else {
          setMessage("Error al iniciar sesión automáticamente");
        }
      }
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
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
          Registro
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
            <p className="text-sm text-red-600  mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <input
            name="name"
            type="text"
            placeholder="Nombre (opcional)"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
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
            <p className="text-sm text-red-600  mt-1">{errors.password}</p>
          )}
        </div>

        <LoadingButton type="submit" loading={loading} className="w-full">
          Registrarse
        </LoadingButton>

        {message && (
          <p className="text-center text-sm text-purple-700 font-medium">
            {message}
          </p>
        )}
        <p className="text-sm text-center text-gray-600">
          ¿Ya tienes cuenta?{" "}
          <button
            type="button"
            onClick={() => router.push("/auth/login")}
            className="text-purple-700 hover:underline"
          >
            Inicia sesión
          </button>
        </p>
      </form>
    </main>
  );
}
