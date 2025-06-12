"use client";

import { Loader } from "lucide-react";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children: ReactNode;
}

export default function LoadingButton({
  loading = false,
  children,
  disabled,
  className = "",
  ...props
}: LoadingButtonProps) {
  return (
    <button
      disabled={loading || disabled}
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded text-white transition
        ${loading || disabled ? "bg-purple-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"}
        ${className}`}
      {...props}
    >
      {loading && <Loader className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}
