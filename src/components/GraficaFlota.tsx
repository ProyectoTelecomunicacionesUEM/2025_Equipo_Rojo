"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function GraficaFlota({ datos }: { datos: any[] }) {
  // Damos la vuelta a los datos para que el tiempo vaya de izquierda a derecha
  const dataReversed = [...datos].reverse();

  return (
    <div style={{ 
      width: '100%', 
      height: '450px', // Aumentamos la altura total
      background: 'var(--bg-card)', 
      padding: '20px', 
      borderRadius: '12px', 
      marginTop: '20px', 
      border: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column' // Alineamos título arriba y gráfica abajo
    }}>
      <h3 style={{ 
        marginBottom: '20px', 
        fontSize: '16px',
        fontWeight: 'bold',
        flexShrink: 0 // Evita que el título se aplaste
      }}>
        Tendencia de Temperatura (Histórico)
      </h3>

      {/* Este div intermedio asegura que Recharts calcule bien el espacio restante */}
      <div style={{ flexGrow: 1, width: '100%', minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
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
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--bg-card)', 
                borderColor: 'var(--border-color)', 
                borderRadius: '8px',
                color: 'var(--foreground)' 
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
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}