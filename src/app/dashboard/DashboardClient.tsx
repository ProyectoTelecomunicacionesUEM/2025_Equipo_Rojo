// src/app/dashboard/DashboardClient.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  FaThermometerHalf, 
  FaTruck, 
  FaBoxOpen, 
  FaExclamationTriangle, 
  FaMapMarkerAlt,
  FaClock 
} from "react-icons/fa";

// --- Mock Data (Datos Falsos) ---
const INITIAL_TRUCKS = [
  { id: "FTR-101", driver: "Juan P.", route: "Madrid - Valencia", temp: -18.2, status: "En Ruta", lat: 40.416, lng: -3.703 },
  { id: "FTR-104", driver: "Ana M.", route: "Barcelona - Zaragoza", temp: -20.5, status: "En Ruta", lat: 41.385, lng: 2.173 },
  { id: "FTR-202", driver: "Carlos R.", route: "Sevilla - Málaga", temp: -15.0, status: "Alerta", lat: 37.389, lng: -5.984 },
];

const RECENT_DELIVERIES = [
  { id: "DEL-885", truckId: "FTR-101", origin: "Mercamadrid", dest: "Carrefour Valencia", status: "En Tránsito", temp: "-18.2°C" },
  { id: "DEL-884", truckId: "FTR-104", origin: "Puerto BCN", dest: "Logística ZGZ", status: "En Tránsito", temp: "-20.5°C" },
  { id: "DEL-883", truckId: "FTR-099", origin: "Vigo", dest: "Madrid Central", status: "Entregado", temp: "-19.0°C" },
  { id: "DEL-882", truckId: "FTR-202", origin: "Huelva", dest: "Málaga", status: "Pendiente", temp: "-15.0°C" },
];

interface DashboardClientProps {
  userName: string;
}

export default function DashboardClient({ userName }: DashboardClientProps) {
  const [trucks, setTrucks] = useState(INITIAL_TRUCKS);

  // Simulación de "Tiempo Real": Variación leve de temperatura cada 3 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setTrucks((current) =>
        current.map((truck) => ({
          ...truck,
          temp: parseFloat((truck.temp + (Math.random() * 0.4 - 0.2)).toFixed(1)),
        }))
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Panel de Control</h1>
          <p className="text-slate-500">Bienvenido de vuelta, <span className="text-blue-600 font-medium">{userName}</span></p>
        </div>
        <div className="text-sm bg-white px-4 py-2 rounded-full shadow-sm text-slate-600 border border-slate-200">
          <span className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            Sistema Operativo • Actualizado hace 1 min
          </span>
        </div>
      </div>

      {/* 1. KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard 
          title="Temp. Promedio" 
          value="-18.4°C" 
          icon={<FaThermometerHalf />} 
          trend="+0.2%" 
          trendColor="text-emerald-500" 
          color="blue"
        />
        <KpiCard 
          title="Camiones Activos" 
          value="12/15" 
          icon={<FaTruck />} 
          trend="80% Capacidad" 
          trendColor="text-slate-500" 
          color="indigo"
        />
        <KpiCard 
          title="Entregas Pendientes" 
          value="8" 
          icon={<FaBoxOpen />} 
          trend="-2 vs ayer" 
          trendColor="text-emerald-500" 
          color="orange"
        />
        <KpiCard 
          title="Alertas Críticas" 
          value="1" 
          icon={<FaExclamationTriangle />} 
          trend="Requiere Atención" 
          trendColor="text-red-500" 
          color="red"
          alert
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 2. Monitorización en Tiempo Real (Ocupa 1 columna) */}
        <section className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FaMapMarkerAlt className="text-blue-500" /> Flota en Ruta
          </h2>
          <div className="space-y-3">
            {trucks.map((truck) => (
              <motion.div 
                key={truck.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden"
              >
                {/* Indicador lateral de estado */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${truck.temp > -16 ? 'bg-red-500' : 'bg-emerald-500'}`} />
                
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-slate-700">{truck.id}</h3>
                    <p className="text-xs text-slate-500">{truck.driver}</p>
                  </div>
                  <span className={`text-sm font-mono font-bold px-2 py-1 rounded ${truck.temp > -16 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    {truck.temp.toFixed(1)}°C
                  </span>
                </div>
                <div className="text-sm text-slate-600 flex items-center gap-1">
                  <FaTruck className="text-slate-400" /> {truck.route}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 3. Tabla de Rutas (Ocupa 2 columnas) */}
        <section className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FaClock className="text-blue-500" /> Últimas Entregas
          </h2>
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider text-xs">
                  <tr>
                    <th className="px-6 py-4">ID Camión</th>
                    <th className="px-6 py-4">Origen / Destino</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4 text-right">Temp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {RECENT_DELIVERIES.map((del) => (
                    <tr key={del.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{del.truckId}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span>{del.origin}</span>
                          <span className="text-xs text-slate-400">➔ {del.dest}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={del.status} />
                      </td>
                      <td className="px-6 py-4 text-right font-mono">{del.temp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

// --- Componentes Pequeños ---

function KpiCard({ title, value, icon, trend, trendColor, color, alert = false }: any) {
  const colorClasses: any = {
    blue: "bg-blue-50 text-blue-600",
    indigo: "bg-indigo-50 text-indigo-600",
    orange: "bg-orange-50 text-orange-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className={`bg-white p-6 rounded-xl shadow-sm border ${alert ? 'border-red-200 ring-2 ring-red-50' : 'border-slate-100'}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        {alert && <span className="animate-pulse h-3 w-3 rounded-full bg-red-500"></span>}
      </div>
      <div>
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
      </div>
      <div className={`text-xs font-medium mt-3 ${trendColor}`}>
        {trend}
      </div>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    "En Tránsito": "bg-blue-100 text-blue-700",
    "Entregado": "bg-emerald-100 text-emerald-700",
    "Pendiente": "bg-slate-100 text-slate-700",
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status] || 'bg-gray-100'}`}>
      {status}
    </span>
  );
}