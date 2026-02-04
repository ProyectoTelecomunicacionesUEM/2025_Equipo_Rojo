import { db } from "@/lib/db";
import GraficaFlota from "@/components/GraficaFlota";
import Link from "next/link";

export const revalidate = 0; 

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  // Configuración de paginación
  const limit = 10;
  const currentPage = Number(searchParams.page) || 1;
  const offset = (currentPage - 1) * limit;

  let medicionesTabla: any[] = [];
  let medicionesGrafica: any[] = [];
  let totalLecturas = 0;
  let totalCamiones = 0;

  try {
    // 1. Datos para la Tabla (Paginados con LIMIT y OFFSET)
    const resTabla = await db.query(
      "SELECT * FROM measurements ORDER BY created_at DESC LIMIT $1 OFFSET $2",
      [limit, offset]
    );
    medicionesTabla = resTabla.rows;

    // 2. Datos para la Gráfica (Siempre los últimos 30 para tendencia)
    const resGrafica = await db.query(
      "SELECT * FROM measurements ORDER BY created_at DESC LIMIT 30"
    );
    medicionesGrafica = resGrafica.rows;
    
    // 3. Totales para contadores y paginación
    const resCount = await db.query("SELECT COUNT(*) as count FROM measurements");
    totalLecturas = parseInt(resCount.rows[0].count);

    const resCamiones = await db.query("SELECT COUNT(DISTINCT device_id) as count FROM measurements");
    totalCamiones = parseInt(resCamiones.rows[0].count);
  } catch (error) {
    console.error("Error al leer Neon:", error);
  }

  const hasNextPage = totalLecturas > currentPage * limit;

  return (
    <div style={{ padding: "40px", backgroundColor: "var(--background)", color: "var(--foreground)", minHeight: "100vh" }}>
      <h1 style={{ marginBottom: "20px" }}>Panel de Control de Flota</h1>
      
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div style={cardStyle}>
          <h3 style={{ fontSize: "12px", color: "var(--text-muted)" }}>CAMIONES REGISTRADOS</h3>
          <p style={{ fontSize: "36px", fontWeight: "bold", margin: "10px 0" }}>{totalCamiones}</p>
        </div>
        <div style={cardStyle}>
          <h3 style={{ fontSize: "12px", color: "var(--text-muted)" }}>TOTAL LECTURAS (BBDD)</h3>
          <p style={{ fontSize: "36px", fontWeight: "bold", margin: "10px 0" }}>{totalLecturas}</p>
        </div>
      </div>

      <div style={{ marginBottom: "40px" }}>
        <GraficaFlota datos={medicionesGrafica} />
      </div>

      <div style={{ background: "var(--bg-card)", padding: "20px", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3>Actividad Reciente (Página {currentPage})</h3>
          
          {/* BOTONES DE PAGINACIÓN */}
          <div style={{ display: "flex", gap: "10px" }}>
            {currentPage > 1 && (
              <Link href={`/admin?page=${currentPage - 1}`} style={btnPagination}>← Anterior</Link>
            )}
            {hasNextPage && (
              <Link href={`/admin?page=${currentPage + 1}`} style={btnPagination}>Siguiente →</Link>
            )}
          </div>
        </div>

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
            {medicionesTabla.map((m) => {
              const esPeligroso = m.temperature > 5;
              return (
                <tr key={m.id} style={{ borderBottom: "1px solid var(--border-color)", backgroundColor: esPeligroso ? "rgba(231, 76, 60, 0.1)" : "transparent" }}>
                  <td style={tdStyle}>{esPeligroso && "⚠️ "}{m.device_id}</td>
                  <td style={{ ...tdStyle, fontWeight: "bold", color: esPeligroso ? "#ff4d4f" : "#0b5fff" }}>
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

const cardStyle: React.CSSProperties = { flex: 1, padding: "20px", background: "var(--bg-card)", borderRadius: "12px", border: "1px solid var(--border-color)" };
const thStyle: React.CSSProperties = { padding: "12px", color: "var(--text-muted)", fontSize: "14px" };
const tdStyle: React.CSSProperties = { padding: "12px", fontSize: "14px" };
const btnPagination: React.CSSProperties = { padding: "8px 16px", background: "var(--primary)", color: "#000", textDecoration: "none", borderRadius: "8px", fontWeight: "bold", fontSize: "14px" };