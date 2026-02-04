import { db } from "@/lib/db";

export const revalidate = 0;

export default async function FleetStatusPage() {
  // SQL para obtener solo la ÚLTIMA medición de cada camión distinto
  const res = await db.query(`
    SELECT DISTINCT ON (device_id) 
      device_id, temperature, status, created_at 
    FROM measurements 
    ORDER BY device_id, created_at DESC
  `);
  const flota = res.rows;

  return (
    <div style={{ padding: "40px", minHeight: "100vh" }}>
      {/* Animación CSS para las alertas */}
      <style>{`
        @keyframes pulse-red {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
        .alerta-parpado {
          animation: pulse-red 1.5s infinite;
        }
      `}</style>

      <h1 style={{ 
        color: "var(--foreground)", 
        marginBottom: "30px", 
        fontSize: "28px", 
        fontWeight: "bold" 
      }}>
        Estado Actual de la Flota
      </h1>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", 
        gap: "25px" 
      }}>
        {flota.map((camion) => {
          const isHot = camion.temperature > 5;
          // Simulamos valores extra (si no están en tu BD, puedes quitarlos)
          const bateria = 85; 
          const tieneGps = true;

          return (
            <div key={camion.device_id} style={{
              padding: "24px",
              background: "#ffffff", // Tarjetas blancas para que destaquen
              borderRadius: "16px",
              borderLeft: `10px solid ${isHot ? "#ff4d4f" : "#2ecc71"}`,
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
              color: "#1a1a1a",
              position: "relative",
              transition: "transform 0.2s ease"
            }}>
              
              {/* Indicadores de Sensores (Top Right) */}
              <div style={{ 
                position: "absolute", 
                top: "20px", 
                right: "20px", 
                display: "flex", 
                gap: "12px",
                fontSize: "14px",
                alignItems: "center"
              }}>
                <span title="GPS Activo">{tieneGps ? "🛰️" : "❌"}</span>
                <span style={{ 
                  fontWeight: "700", 
                  color: bateria < 20 ? "#ff4d4f" : "#2ecc71",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px"
                }}>
                  {bateria}% 🔋
                </span>
              </div>

              {/* Título del Camión */}
              <h3 style={{ 
                margin: 0, 
                fontSize: "12px", 
                color: "#888", 
                textTransform: "uppercase",
                letterSpacing: "1px",
                fontWeight: "700"
              }}>
                🚚 {camion.device_id.replace("_", " ")}
              </h3>

              {/* Temperatura Principal */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "12px 0" }}>
                <p style={{ 
                  fontSize: "38px", 
                  fontWeight: "800", 
                  margin: 0,
                  color: isHot ? "#ff4d4f" : "#1a1a1a",
                  letterSpacing: "-1.5px"
                }}>
                  {camion.temperature}°C
                </p>
                
                {isHot && (
                  <span className="alerta-parpado" style={{ 
                    background: "#fff1f0",
                    color: "#ff4d4f",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    fontSize: "11px",
                    fontWeight: "800",
                    border: "1px solid #ffa39e",
                    textTransform: "uppercase"
                  }}>
                    ⚠️ Revisar Nevera
                  </span>
                )}
              </div>

              {/* Info Inferior (Footer de la tarjeta) */}
              <div style={{ 
                marginTop: "15px",
                paddingTop: "15px", 
                borderTop: "1px solid #f0f0f0",
                fontSize: "13px"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#555" }}>
                  <span>Estado: <strong style={{ color: "#1a1a1a" }}>{camion.status}</strong></span>
                  <span style={{ opacity: 0.7 }}>
                    🕒 {new Date(camion.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}