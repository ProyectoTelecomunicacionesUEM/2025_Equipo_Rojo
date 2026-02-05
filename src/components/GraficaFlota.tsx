"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function GraficaFlota({ datos }: { datos: any[] }) {
  // Damos la vuelta a los datos para que el tiempo vaya de izquierda a derecha
  const dataReversed = datos && datos.length > 0 ? [...datos].reverse() : [];

  return (
    <div style={{ 
      width: '100%', 
      background: 'var(--bg-card)', 
      padding: '20px', 
      borderRadius: '12px', 
      marginTop: '20px', 
      border: '1px solid var(--border-color)',
    }}>
      <h3 style={{ 
        marginBottom: '20px', 
        fontSize: '16px',
        fontWeight: 'bold',
        color: 'var(--foreground)'
      }}>
        Tendencia de Temperatura (Histórico)
      </h3>

      {/* QUITAMOS el flex y el height: 100% que daban error. 
          Ponemos un alto fijo de 350px al ResponsiveContainer.
      */}
      <div style={{ width: '100%', minHeight: '350px' }}>
        <ResponsiveContainer width="99%" height={350}>
          <LineChart data={dataReversed} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
            <XAxis 
              dataKey="created_at" 
              hide 
            />
            <YAxis 
              stroke="var(--text-muted)" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={['auto', 'auto']}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1e293b', 
                borderColor: '#334155', 
                borderRadius: '8px',
                color: '#f8fafc' 
              }}
              itemStyle={{ color: '#0b5fff' }}
            />
            <Line 
              type="monotone" 
              dataKey="temperature" 
              stroke="#0b5fff" 
              strokeWidth={3} 
              dot={{ r: 3, fill: '#0b5fff' }} 
              activeDot={{ r: 6, strokeWidth: 0 }} 
              isAnimationActive={false} // Desactivamos animación para evitar parpadeos en renders rápidos
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}