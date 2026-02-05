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
      <div className="mx-auto max-w-[900px] px-5 py-10">

        {/* HEADER */}
        <header className="mb-10">
          <h1 className="text-3xl font-black">Control de Flota ❄️</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Operador: <span className="font-bold text-sky-500">{(session?.user as any)?.name || "Admin"}</span>
          </p>
        </header>

        {/* TARJETA PRINCIPAL */}
        <div className="mb-10 flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-10 shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <div>
            <span className="text-xs font-extrabold tracking-widest text-sky-500">UNIDAD ACTIVA</span>
            <h2 className="my-1 text-5xl font-black">{camion.id}</h2>
            <div className={`mt-3 inline-block rounded-lg border px-3 py-1 text-sm font-bold ${
              camion.temp > 5 ? "border-red-400/30 bg-red-400/10 text-red-400" : "border-green-400/30 bg-green-400/10 text-green-400"
            }`}>
              {camion.temp > 5 ? "⚠️ ALERTA: REVISAR FRÍO" : "✅ SISTEMA ESTABLE"}
            </div>
          </div>
          <div className="text-[100px] font-black leading-none">
            {camion.temp}<span className="text-4xl text-slate-400">°</span>
          </div>
        </div>

      {/* GRÁFICA REAL */}
        <div className="mb-10 rounded-3xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
          {/* QUITAMOS EL h3 QUE ESTABA AQUÍ PORQUE LA GRÁFICA YA TRAE EL SUYO */}
          
          <div className="h-[400px] w-full p-4"> {/* Añadimos un poco de padding aquí */}
            {historico.length > 0 ? (
              <GraficaFlota datos={historico} />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-400">
                Sincronizando telemetría...
              </div>
            )}
          </div>
        </div>
        {/* TABLA */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="px-5 py-4 text-left text-xs font-extrabold text-slate-500">SENSOR</th>
                <th className="px-5 py-4 text-left text-xs font-extrabold text-slate-500">VALOR</th>
                <th className="px-5 py-4 text-left text-xs font-extrabold text-slate-500">ESTADO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              <tr>
                <td className="px-5 py-4">Cámara Trasera</td>
                <td className="px-5 py-4 font-bold">{camion.temp}°C</td>
                <td className="px-5 py-4 text-xs font-bold text-sky-500">ACTIVO</td>
              </tr>
              <tr className="bg-slate-50/50 dark:bg-slate-800/30">
                <td className="px-5 py-4">Módulo GPS</td>
                <td className="px-5 py-4 font-bold">Señal Alta</td>
                <td className="px-5 py-4 text-xs font-bold text-sky-500">ONLINE</td>
              </tr>
            </tbody>
          </table>
        </div>

        <footer className="mt-12 text-center text-[11px] tracking-widest opacity-40">
          SISTEMA DE MONITOREO PROFESIONAL V2.0
        </footer>
      </div>
    </div>
  );
}