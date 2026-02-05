"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import GraficaFlota from "@/components/GraficaFlota";

export default function UserDashboard() {
  const { data: session } = useSession();
  const [camion, setCamion] = useState({ id: "Cargando...", temp: -5 });
  const [historico, setHistorico] = useState<{created_at: string, temperature: number}[]>([]);

  useEffect(() => {
    const fetchData = () => {
      fetch("/api/camion")
        .then((res) => res.json())
        .then((data) => {
          if (data?.id) {
            const nuevaTemp = data.temperature ?? -5;
            setCamion({ id: data.id, temp: nuevaTemp });

            setHistorico((prev) => {
              const nuevoPunto = { 
                created_at: new Date().toLocaleTimeString(), 
                temperature: nuevaTemp 
              };
              return [...prev, nuevoPunto].slice(-15);
            });
          }
        })
        .catch(() => setCamion((prev) => ({ ...prev, id: "Sin conexión" })));
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-[900px] px-4 py-6 sm:px-6 sm:py-10">

        {/* HEADER */}
        <header className="mb-6 sm:mb-10 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-black">Control de Flota ❄️</h1>
          <p className="mt-1 text-sm sm:text-base text-slate-500 dark:text-slate-400">
            Operador: <span className="font-bold text-sky-500">{(session?.user as any)?.name || "Admin"}</span>
          </p>
        </header>

        {/* TARJETA PRINCIPAL RESPONSIVE */}
        <div className="mb-6 sm:mb-10 flex flex-col sm:flex-row items-center justify-between rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xl dark:border-slate-800 dark:bg-slate-900 gap-6">
          <div className="text-center sm:text-left">
            <span className="text-[10px] sm:text-xs font-extrabold tracking-widest text-sky-500 uppercase">Unidad Activa</span>
            <h2 className="my-1 text-3xl sm:text-5xl font-black">{camion.id}</h2>
            <div className={`mt-3 inline-block rounded-lg border px-3 py-1 text-xs sm:text-sm font-bold ${
              camion.temp > 5 ? "border-red-400/30 bg-red-400/10 text-red-400" : "border-green-400/30 bg-green-400/10 text-green-400"
            }`}>
              {camion.temp > 5 ? "⚠️ ALERTA: REVISAR FRÍO" : "✅ SISTEMA ESTABLE"}
            </div>
          </div>
          
          {/* Temperatura más grande en móvil y centrada */}
          <div className="text-7xl sm:text-[100px] font-black leading-none flex items-start">
            {camion.temp}
            <span className="text-2xl sm:text-4xl text-slate-400 mt-2">°</span>
          </div>
        </div>

        {/* GRÁFICA RESPONSIVE */}
        <div className="mb-6 sm:mb-10 rounded-3xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
          <div className="h-[300px] sm:h-[400px] w-full p-2 sm:p-4"> 
            {historico.length > 0 ? (
              <GraficaFlota datos={historico} />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-400 text-sm">
                Sincronizando telemetría...
              </div>
            )}
          </div>
        </div>

        {/* TABLA (Con scroll horizontal en móviles muy pequeños) */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full border-collapse min-w-[400px]">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="px-5 py-4 text-left text-[10px] sm:text-xs font-extrabold text-slate-500 uppercase">Sensor</th>
                <th className="px-5 py-4 text-left text-[10px] sm:text-xs font-extrabold text-slate-500 uppercase">Valor</th>
                <th className="px-5 py-4 text-left text-[10px] sm:text-xs font-extrabold text-slate-500 uppercase">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm sm:text-base">
              <tr>
                <td className="px-5 py-4 text-slate-600 dark:text-slate-300">Cámara Trasera</td>
                <td className="px-5 py-4 font-bold">{camion.temp}°C</td>
                <td className="px-5 py-4 text-[10px] sm:text-xs font-bold text-sky-500">ACTIVO</td>
              </tr>
              <tr className="bg-slate-50/50 dark:bg-slate-800/30">
                <td className="px-5 py-4 text-slate-600 dark:text-slate-300">Módulo GPS</td>
                <td className="px-5 py-4 font-bold">Señal Alta</td>
                <td className="px-5 py-4 text-[10px] sm:text-xs font-bold text-sky-500">ONLINE</td>
              </tr>
            </tbody>
          </table>
        </div>

        <footer className="mt-12 mb-6 text-center text-[10px] tracking-widest opacity-40 uppercase">
          SISTEMA DE MONITOREO PROFESIONAL V2.0
        </footer>
      </div>
    </div>
  );
}