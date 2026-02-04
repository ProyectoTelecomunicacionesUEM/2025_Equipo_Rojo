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
    <div style={{ padding: "40px" }}>
      <h1>Estado Actual de la Flota</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px", marginTop: "20px" }}>
        {flota.map((camion) => (
          <div key={camion.device_id} style={{
            padding: "20px",
            background: "#fff",
            borderRadius: "12px",
            borderLeft: `10px solid ${camion.temperature > 5 ? "#e74c3c" : "#2ecc71"}`,
            boxShadow: "0 4px 6px rgba(0,0,0,0.05)"
          }}>
            <h3 style={{ margin: 0 }}>🚚 {camion.device_id}</h3>
            <p style={{ fontSize: "24px", fontWeight: "bold", margin: "10px 0" }}>
              {camion.temperature}°C
            </p>
            <div style={{ fontSize: "14px", color: "#666" }}>
              <p>Estado: <strong>{camion.status}</strong></p>
              <p>Actualizado: {new Date(camion.created_at).toLocaleTimeString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}