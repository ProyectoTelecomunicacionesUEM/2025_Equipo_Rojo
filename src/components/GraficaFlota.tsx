"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function GraficaFlota({ datos }: { datos: any[] }) {
  // Damos la vuelta a los datos para que el tiempo vaya de izquierda a derecha
  const dataReversed = [...datos].reverse();

  return (
    <div style={{ width: '100%', height: 300, background: 'var(--bg-card)', padding: '20px', borderRadius: '12px', marginTop: '20px', border: '1px solid var(--border-color)' }}>
      <h3 style={{ marginBottom: '20px' }}>Tendencia de Temperatura (Histórico)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={dataReversed}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
          <XAxis dataKey="created_at" hide />
          <YAxis stroke="var(--text-muted)" />
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--foreground)' }}
          />
          <Line 
            type="monotone" 
            dataKey="temperature" 
            stroke="#0b5fff" 
            strokeWidth={3} 
            dot={{ r: 4 }} 
            activeDot={{ r: 8 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}