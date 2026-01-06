// src/app/dashboard/page.tsx
import { auth } from "@/auth";
import Link from "next/link";
import DashboardClient from "./DashboardClient"; // Importamos el componente cliente

export default async function DashboardPage() {
  const session = await auth();

  // Protección de ruta a nivel de servidor
  if (!session?.user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-50">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center border border-slate-200">
          <div className="mb-4 text-red-500 text-5xl flex justify-center">
            {/* Icono simple si no tienes acceso */}
            ⚠️
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Acceso Restringido</h1>
          <p className="text-slate-500 mb-6">
            Necesitas iniciar sesión para acceder al sistema FrostTrack.
          </p>
          <Link 
            href="/login" 
            className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
          >
            Ir a Login
          </Link>
        </div>
      </main>
    );
  }

  // Si hay sesión, renderizamos el Dashboard Cliente pasando el nombre
  return (
    <main className="min-h-screen bg-slate-50/50">
      <div className="max-w-7xl mx-auto p-4 md:p-8 mt-16 md:mt-20">
        <DashboardClient userName={session.user.name || session.user.email || "Usuario"} />
      </div>
    </main>
  );
}