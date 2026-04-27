import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Palomino Learning - Autenticación",
  description: "Iniciar sesión o registrarse en Palomino Learning",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950">
      {children}
    </div>
  );
}
