import { db, trucks, subscribers } from "@/lib/db";
import { asignarCamionAction } from "./actions";
import { revalidatePath } from "next/cache";
import ConfirmAddTruckButton from "@/components/ConfirmAddTruckButton";
import ConfirmGuardarAsignacion from "@/components/ConfirmGuardarAsignacion";
import Link from "next/link";
import { count } from "drizzle-orm";

export default async function GestionDispositivos({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }> | { page?: string };
}) {
  // --- Lógica de Paginación ---
  const params = await searchParams;
  const limit = 10;
  const currentPage = Number(params.page) || 1;
  const offset = (currentPage - 1) * limit;

  // Consultas con límite
  const listaCamiones = await db.select().from(trucks).limit(limit).offset(offset);
  const listaUsuarios = await db.select().from(subscribers); 

  // Verificar si hay más páginas
  const totalRes = await db.select({ total: count() }).from(trucks);
  const totalCamiones = Number(totalRes[0].total);
  const hasNextPage = totalCamiones > currentPage * limit;

  async function crearCamion(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    if (!id) return;

    try {
      const { db, trucks } = await import("@/lib/db");
      await db.insert(trucks).values({ id }); 
      revalidatePath("/admin/devices");
    } catch (e) {
      console.log("El camión ya existe");
    }
  }

  return (
    <div className="min-h-screen w-full bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100 p-3 sm:p-10">
      <div className="mx-auto max-w-[900px]">
        
        <h1 className="text-2xl sm:text-3xl font-black mb-8 flex items-center gap-3">
          🛠️ <span className="tracking-tight">Asignación de Conductores</span>
        </h1>
        
        {/* --- FORMULARIO DE AÑADIR --- */}
        <div className="mb-10 rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">
            Añadir Camión a la Flota
          </h3>
          <form action={crearCamion} className="flex flex-col sm:flex-row gap-3">
            <input 
              name="id" 
              placeholder="Matrícula (ej: CAMION-01)" 
              required 
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-2 focus:ring-sky-600 outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            />
            <ConfirmAddTruckButton />
          </form>
        </div>

        {/* --- TABLA DE GESTIÓN --- */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
          
          {/* BARRA DE PAGINACIÓN SUPERIOR */}
          <div className="flex justify-between items-center p-6 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-sm sm:text-base">Listado de Flota</h3>
            
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Pág. {currentPage}</span>
              <div className="flex gap-2">
                {currentPage > 1 ? (
                  <Link href={`/admin/devices?page=${currentPage - 1}`} className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-sm font-bold transition-all">←</Link>
                ) : (
                  <span className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-400 rounded-xl text-sm cursor-not-allowed">←</span>
                )}
                {hasNextPage ? (
                  <Link href={`/admin/devices?page=${currentPage + 1}`} className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-sm font-bold transition-all">→</Link>
                ) : (
                  <span className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-400 rounded-xl text-sm cursor-not-allowed">→</span>
                )}
              </div>
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th className="px-3 sm:px-6 py-4 text-left text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Camión</th>
                  <th className="px-3 sm:px-6 py-4 text-left text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Conductor</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {listaCamiones.map((c) => (
                  <tr key={c.id + (c.operator_id || "vacio")} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-3 sm:px-6 py-5 font-black text-sm sm:text-lg">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <span>🚛</span>
                        <span className="truncate">{c.id}</span>
                      </div>
                    </td>

                    <td className="px-3 sm:px-6 py-5">
                      <form action={asignarCamionAction} className="flex flex-col sm:flex-row gap-2">
                        <input type="hidden" name="truckId" value={c.id} />
                        <select 
                          name="email" 
                          defaultValue={c.operator_id || ""} 
                          className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-sky-600 outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                        >
                          <option value="">-- Sin asignar --</option>
                          {listaUsuarios.map(u => (
                            <option key={u.id} value={u.email}>{u.email}</option>
                          ))}
                        </select>
                        <ConfirmGuardarAsignacion truckId={c.id} />
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {listaCamiones.length === 0 && (
            <div className="p-10 text-center text-slate-400 italic text-sm">
              No hay más camiones en esta página.
            </div>
          )}
        </div>

        <footer className="mt-12 text-center text-[10px] tracking-widest opacity-40 uppercase">
          Gestión de Dispositivos v2.0
        </footer>
      </div>
    </div>
  );
}