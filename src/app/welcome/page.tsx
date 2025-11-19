import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function WelcomePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { user } = session;
  const userId = (user as typeof user & { id?: string | null }).id ?? "No disponible";
  const displayName = user.name || user.email;

  return (
    <main className="max-w-3xl mx-auto px-6 py-16 space-y-8">
      <section className="space-y-2">
        <p className="text-sm uppercase tracking-wide text-gray-500">
          Inicio de sesión correcto
        </p>
        <h1 className="text-4xl font-semibold">Bienvenido, {displayName}</h1>
        <p className="text-gray-600">
          Ya puedes explorar tus finanzas con Finwise. Guarda esta página como punto de
          partida para acceder rápidamente a tus datos personales.
        </p>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white/60 p-6 shadow-sm">
        <h2 className="text-lg font-medium mb-4">Tu sesión</h2>
        <ul className="space-y-2 text-gray-700">
          <li>
            <span className="font-semibold">Nombre:</span>{" "}
            {user.name ?? "Sin nombre registrado"}
          </li>
          <li>
            <span className="font-semibold">Email:</span> {user.email}
          </li>
          <li>
            <span className="font-semibold">Identificador:</span> {userId}
          </li>
        </ul>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-gray-200 bg-white/60 p-5 shadow-sm">
          <h3 className="text-base font-semibold mb-2">Próximos pasos</h3>
          <p className="text-sm text-gray-600">
            Revisa la sección de transacciones y añade tus gastos o ingresos más
            recientes para mantener tus finanzas al día.
          </p>
        </article>
        <article className="rounded-xl border border-gray-200 bg-white/60 p-5 shadow-sm">
          <h3 className="text-base font-semibold mb-2">Atajos útiles</h3>
          <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
            <li>Actualiza tus categorías favoritas.</li>
            <li>Consulta el dashboard para ver tus métricas clave.</li>
            <li>Exporta los datos si necesitas compartirlos.</li>
          </ul>
        </article>
      </section>
    </main>
  );
}
