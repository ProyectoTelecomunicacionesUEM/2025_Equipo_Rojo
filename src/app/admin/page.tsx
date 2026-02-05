import { db, measurements, trucks } from "@/lib/db";
import GraficaFlota from "@/components/GraficaFlota";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions";
import { redirect } from "next/navigation";
import { desc, count, inArray } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }> | { page?: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session || (session?.user as any)?.role !== "admin") {
    redirect("/login");
  }

  const params = await searchParams;
  const limit = 10;
  const currentPage = Number(params.page) || 1;
  const offset = (currentPage - 1) * limit;

  let medicionesTabla: any[] = [];
  let medicionesGrafica: any[] = [];
  let totalLecturas = 0;
  let totalCamiones = 0;

  try {
    const misCamiones = await db.select({ id: trucks.id }).from(trucks);
    const idsReales = misCamiones.map((t) => t.id);

    if (idsReales.length > 0) {
      medicionesTabla = await db
        .select()
        .from(measurements)
        .where(inArray(measurements.device_id, idsReales))
        .orderBy(desc(measurements.created_at))
        .limit(limit)
        .offset(offset);

      medicionesGrafica = await db
        .select()
        .from(measurements)
        .where(inArray(measurements.device_id, idsReales))
        .orderBy(desc(measurements.created_at))
        .limit(30);

      const resCount = await db
        .select({ total: count() })
        .from(measurements)
        .where(inArray(measurements.device_id, idsReales));
      
      totalLecturas = Number(resCount[0].total);
      totalCamiones = idsReales.length;
    }
  } catch (error) {
    console.error("Error en DB:", error);
  }

  const hasNextPage = totalLecturas > currentPage * limit;

  return (
    <div className="min-h-screen w-full bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
      <div className="mx-auto max-w-[1200px] px-5 py-10">
        
        {/* HEADER */}
        <header className="mb-10 flex justify-between items-center">
          <h1 className="text-3xl font-black tracking-tight">
            Control de flota en tiempo real 🚛
          </h1>
        </header>

        {/* TARJETAS DE RESUMEN */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-extrabold tracking-widest text-slate-400 uppercase">
              Camiones Gestionados
            </span>
            <p className="mt-2 text-5xl font-black">{totalCamiones}</p>
          </div>
          
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <span className="text-xs font-extrabold tracking-widest text-slate-400 uppercase">
              Lecturas de tu flota
            </span>
            <p className="mt-2 text-5xl font-black">{totalLecturas}</p>
          </div>
        </div>

        {/* GRÁFICA */}
        <div className="mb-10 rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Tendencia de Temperatura (Histórico Real)
            </h3>
          </div>
          <div className="h-[400px] w-full p-6">
            <GraficaFlota datos={medicionesGrafica} />
          </div>
        </div>

        {/* TABLA */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
          <div className="flex justify-between items-center p-6 bg-slate-50/50 dark:bg-slate-800/50">
            <h3 className="font-bold">Últimos Registros</h3>
            
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Pág. {currentPage}</span>
              <div className="flex gap-2">
                {currentPage > 1 ? (
                  <Link href={`/admin?page=${currentPage - 1}`} className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-sm font-bold transition-all">←</Link>
                ) : (
                  <span className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-400 rounded-xl text-sm cursor-not-allowed">←</span>
                )}
                {hasNextPage ? (
                  <Link href={`/admin?page=${currentPage + 1}`} className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-sm font-bold transition-all">→</Link>
                ) : (
                  <span className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-400 rounded-xl text-sm cursor-not-allowed">→</span>
                )}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">ID Camión</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Temp.</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Estado</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Hora</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {medicionesTabla.map((m: any) => {
                  const alerta = m.temperature > 5;
                  return (
                    <tr key={m.id} className={`${alerta ? 'bg-red-50/30 dark:bg-red-900/10' : ''} hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors`}>
                      <td className="px-6 py-4 font-medium">{alerta ? "⚠️ " : "🚛 "}{m.device_id}</td>
                      <td className={`px-6 py-4 font-black ${alerta ? "text-red-500" : "text-sky-500"}`}>
                        {m.temperature}°C
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          alerta 
                            ? "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/40 dark:text-red-400 dark:border-red-800" 
                            : "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/40 dark:text-green-400 dark:border-green-800"
                        }`}>
                          {m.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-sm italic">
                        {m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}