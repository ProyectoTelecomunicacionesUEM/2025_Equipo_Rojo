import { db, trucks } from "@/lib/db";
import { sql } from "drizzle-orm";

export const revalidate = 0;

export default async function FleetStatusPage() {
  // 1. Traemos los camiones registrados
  const misCamionesAsignados = await db.select().from(trucks);

  // 2. Traemos las últimas mediciones usando SQL puro para el DISTINCT ON
  const res = await db.execute(sql`
    SELECT DISTINCT ON (device_id) 
      device_id, temperature, status, created_at 
    FROM measurements 
    ORDER BY device_id, created_at DESC
  `);
  const todasLasMediciones = res.rows as any[];

  return (
    <div className="min-h-screen w-full bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100 p-10">
      <div className="mx-auto max-w-[1200px]">
        
        <header className="mb-10">
          <h1 className="text-3xl font-black tracking-tight">
            Estado Real de Mis Camiones 🚛
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Monitoreo en vivo de unidades activas y temperatura.
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {misCamionesAsignados.map((camion) => {
            const medicion = todasLasMediciones.find(m => m.device_id === camion.id);
            const isHot = medicion ? medicion.temperature > 5 : false;

            return (
              <div 
                key={camion.id} 
                className={`relative overflow-hidden rounded-3xl border bg-white p-8 shadow-xl transition-all hover:shadow-2xl dark:bg-slate-900 
                  ${medicion 
                    ? (isHot ? "border-l-[12px] border-l-red-500 border-slate-200 dark:border-slate-800" : "border-l-[12px] border-l-emerald-500 border-slate-200 dark:border-slate-800") 
                    : "border-l-[12px] border-l-slate-300 border-slate-200 dark:border-slate-800 dark:border-l-slate-700"
                  }`}
              >
                {/* ID del Camión */}
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
                    Unidad: <span className="text-slate-900 dark:text-white">{camion.id}</span>
                  </h3>
                  {medicion && (
                    <span className={`flex h-3 w-3 rounded-full ${isHot ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                  )}
                </div>
                
                {/* Conductor */}
                <p className={`text-sm font-bold mb-6 flex items-center gap-2 ${camion.operator_id ? "text-sky-500" : "text-amber-500"}`}>
                  <span className="opacity-70">👤</span> {camion.operator_id || "Sin conductor asignado"}
                </p>

                {/* Temperatura Principal */}
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-6xl font-black tracking-tighter">
                    {medicion ? medicion.temperature : "--"}
                  </span>
                  <span className="text-2xl font-bold text-slate-400">°C</span>
                  {!medicion && (
                    <span className="ml-2 text-[10px] font-bold uppercase text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                      Desconectado
                    </span>
                  )}
                </div>

                {/* Footer de la Card */}
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-[11px] font-medium text-slate-400 flex justify-between uppercase tracking-tighter">
                    <span>Estado: {medicion ? medicion.status : "Sin Señal"}</span>
                    <span>
                      {medicion 
                        ? `Sinc: ${new Date(medicion.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                        : "Esperando script..."}
                    </span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {misCamionesAsignados.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-slate-400 font-medium italic">No se encontraron camiones registrados en la base de datos.</p>
          </div>
        )}

      </div>
    </div>
  );
}