import { db } from "@/lib/db";

export const revalidate = 0; 

export default async function AdminDashboard() {
  let mediciones: any[] = [];
  let totalCamiones = 0;

  try {
    const res = await db.query("SELECT * FROM measurements ORDER BY created_at DESC");
    mediciones = res.rows;
    
    const resCount = await db.query("SELECT COUNT(DISTINCT device_id) as count FROM measurements");
    totalCamiones = resCount.rows[0].count;
  } catch (error) {
    console.error("Error al leer Neon:", error);
  }

  return (
    <div style={{ 
      padding: "40px", 
      backgroundColor: "var(--background)", // Se adapta al modo oscuro
      color: "var(--foreground)",           // Se adapta al modo oscuro
      minHeight: "100vh",
      transition: "background-color 0.3s ease" 
    }}>
      <h1 style={{ marginBottom: "20px" }}>Panel de Control de Flota</h1>
      
      <div style={{ display: "flex", gap: "20px", marginBottom: "40px" }}>
        <div style={cardStyle}>
          <h3 style={{ fontSize: "12px", color: "var(--text-muted)" }}>CAMIONES REGISTRADOS</h3>
          <p style={{ fontSize: "36px", fontWeight: "bold", margin: "10px 0" }}>{totalCamiones}</p>
        </div>
        
        <div style={cardStyle}>
          <h3 style={{ fontSize: "12px", color: "var(--text-muted)" }}>TOTAL LECTURAS</h3>
          <p style={{ fontSize: "36px", fontWeight: "bold", margin: "10px 0" }}>{mediciones.length}</p>
        </div>
      </div>

      <div style={{ 
        background: "var(--bg-card)", 
        padding: "20px", 
        borderRadius: "12px", 
        border: "1px solid var(--border-color)",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)" 
      }}>
        <h3>Actividad de los Camiones</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "15px" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid var(--border-color)", textAlign: "left" }}>
              <th style={thStyle}>ID Camión</th>
              <th style={thStyle}>Temperatura</th>
              <th style={thStyle}>Estado</th>
              <th style={thStyle}>Hora</th>
            </tr>
          </thead>
          <tbody>
            {mediciones.map((m) => {
              const esPeligroso = m.temperature > 5;
              return (
                <tr key={m.id} style={{ 
                  borderBottom: "1px solid var(--border-color)",
                  backgroundColor: esPeligroso ? "rgba(231, 76, 60, 0.1)" : "transparent" 
                }}>
                  <td style={tdStyle}>{esPeligroso && "⚠️ "}{m.device_id}</td>
                  <td style={{ 
                    ...tdStyle, 
                    fontWeight: "bold", 
                    color: esPeligroso ? "#ff4d4f" : "#0b5fff" // Colores que resaltan en oscuro
                  }}>
                    {m.temperature}°C
                  </td>
                  <td style={tdStyle}>{m.status}</td>
                  <td style={tdStyle}>{new Date(m.created_at).toLocaleTimeString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Estilos usando las variables que ya definiste en Usuarios
const cardStyle: React.CSSProperties = { 
  flex: 1, 
  padding: "20px", 
  background: "var(--bg-card)", 
  borderRadius: "12px", 
  border: "1px solid var(--border-color)",
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)" 
};

const thStyle: React.CSSProperties = { padding: "12px", color: "var(--text-muted)", fontSize: "14px" };
const tdStyle: React.CSSProperties = { padding: "12px", fontSize: "14px" };