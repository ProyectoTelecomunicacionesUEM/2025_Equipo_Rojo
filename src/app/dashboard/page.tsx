import { auth } from "@/auth";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <main className="max-w-xl mx-auto p-6 mt-24">
        <h1 className="text-2xl font-semibold">Necesitas iniciar sesión</h1>
        <p className="mt-2">
          <Link href="/login" className="underline">
            Ir a Login
          </Link>
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-6 mt-24">
      <h1 className="text-3xl font-semibold">
        Hola, {session.user.name || session.user.email}
      </h1>
      <p className="text-sm text-gray-600 mt-1">Tu panel privado</p>
      <div className="mt-6 rounded-lg border p-4 bg-white/70">
        <p className="text-gray-700">
          Aquí puedes conectar tus datos bancarios, revisar tus transacciones y automatizar tus
          finanzas. Integra tu backend con las rutas de ejemplo <code>/api/me</code> y{" "}
          <code>/api/transactions</code>.
        </p>
      </div>
    </main>
  );
}
