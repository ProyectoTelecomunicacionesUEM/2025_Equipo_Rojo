import { db } from "@/lib/db";
import GraficaFlota from "@/components/GraficaFlota";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }> | { page?: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session || session?.user?.role !== "admin") {
    redirect("/login");
  }

  const params = await searchParams;
  const limit = 10;
  const currentPage = Number(params.page) || 1;
  const offset = (currentPage - 1) * limit;

  let medicionesTabla: any[] = [];
  let medicionesGrafica: any[] = [];
  let totalLecturas = 0;
  let totalCamiones = 0;

  try {
    const resTabla = await db.query(
      "SELECT * FROM measurements ORDER BY created_at DESC LIMIT $1 OFFSET $2",
      [limit, offset]
    );
    medicionesTabla = resTabla.rows;

    const resGrafica = await db.query("SELECT * FROM measurements ORDER BY created_at DESC LIMIT 30");
    medicionesGrafica = resGrafica.rows;

    const resCount = await db.query("SELECT COUNT(*) as count FROM measurements");
    totalLecturas = parseInt(resCount.rows[0].count);

    const resCamiones = await db.query("SELECT COUNT(DISTINCT device_id) as count FROM measurements");
    totalCamiones = parseInt(resCamiones.rows[0].count);
  } catch (error) {
    console.error("Error en DB:", error);
  }

  const hasNextPage = totalLecturas > currentPage * limit;

  return (
    <div key={currentPage} style={containerStyle}>
      {/* CARDS CON GRID AUTO-ADAPTABLE */}
      <div style={gridResponsiveStyle}>
        <div style={cardStyle}>
          <span style={labelStyle}>CAMIONES ACTIVOS</span>
          <p style={valueStyle}>{totalCamiones}</p>
        </div>
        <div style={cardStyle}>
          <span style={labelStyle}>LECTURAS TOTALES</span>
          <p style={valueStyle}>{totalLecturas}</p>
        </div>
      </div>

      {/* GRÁFICA (ResponsiveContainer ya se encarga del ancho) */}
      <div style={graphWrapperStyle}>
        <GraficaFlota datos={medicionesGrafica} />
      </div>

      {/* SECCIÓN TABLA RESPONSIVE */}
      <div style={tableCardStyle}>
        <div style={tableControlsStyle}>
          <h3 style={{ margin: 0, fontSize: "16px" }}>Historial</h3>
          
          <div style={paginationGroupStyle}>
            <span style={pageNumberStyle}>Pág. {currentPage}</span>
            <div style={{ display: "flex", gap: "4px" }}>
              {currentPage > 1 ? (
                <Link href={`/admin?page=${currentPage - 1}`} style={btnStyle}>←</Link>
              ) : (
                <span style={btnDisabled}>←</span>
              )}
              {hasNextPage ? (
                <Link href={`/admin?page=${currentPage + 1}`} style={btnStyle}>→</Link>
              ) : (
                <span style={btnDisabled}>→</span>
              )}
            </div>
          </div>
        </div>

        {/* CONTENEDOR CON SCROLL HORIZONTAL PARA MÓVILES */}
        <div style={scrollContainerStyle}>
          <table style={tableStyle}>
            <thead>
              <tr style={tableHeaderRowStyle}>
                <th style={thStyle}>ID Camión</th>
                <th style={thStyle}>Temp.</th>
                <th style={thStyle}>Estado</th>
                <th style={thStyle}>Hora</th>
              </tr>
            </thead>
            <tbody>
              {medicionesTabla.map((m) => {
                const alerta = m.temperature > 5;
                return (
                  <tr key={m.id} style={alerta ? rowAlertStyle : rowStyle}>
                    <td style={tdStyle}>{alerta ? "⚠️ " : ""}{m.device_id}</td>
                    <td style={{ ...tdStyle, color: alerta ? "#ff4d4f" : "#0b5fff", fontWeight: "bold" }}>
                      {m.temperature}°C
                    </td>
                    <td style={tdStyle}>
                      <span style={statusTagStyle}>{m.status}</span>
                    </td>
                    <td style={tdStyle}>{new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- SISTEMA DE ESTILOS ADAPTABLES ---

const containerStyle: React.CSSProperties = {
  padding: "16px",
  maxWidth: "1200px",
  margin: "0 auto",
  minHeight: "100vh",
  fontFamily: "system-ui, sans-serif"
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "15px",
  marginBottom: "25px"
};

const titleStyle: React.CSSProperties = { fontSize: "clamp(1.5rem, 5vw, 2rem)", margin: 0 };
const subtitleStyle: React.CSSProperties = { fontSize: "13px", opacity: 0.7, margin: "5px 0 0 0" };

const badgeStyle: React.CSSProperties = {
  background: "rgba(11, 95, 255, 0.1)",
  color: "#0b5fff",
  padding: "4px 12px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "bold"
};

const gridResponsiveStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", // <--- MAGIA: Se ajusta solo
  gap: "16px",
  marginBottom: "25px"
};

const cardStyle: React.CSSProperties = {
  background: "var(--bg-card)",
  padding: "20px",
  borderRadius: "16px",
  border: "1px solid var(--border-color)",
  boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
};

const labelStyle: React.CSSProperties = { fontSize: "11px", fontWeight: "600", color: "var(--text-muted)", letterSpacing: "0.5px" };
const valueStyle: React.CSSProperties = { fontSize: "32px", fontWeight: "800", margin: "8px 0 0 0" };

const graphWrapperStyle: React.CSSProperties = {
  background: "var(--bg-card)",
  borderRadius: "16px",
  border: "1px solid var(--border-color)",
  marginBottom: "25px",
  overflow: "hidden"
};

const tableCardStyle: React.CSSProperties = {
  background: "var(--bg-card)",
  borderRadius: "16px",
  border: "1px solid var(--border-color)",
  padding: "16px"
};

const tableControlsStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "15px",
  marginBottom: "15px"
};

const paginationGroupStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: "12px" };
const pageNumberStyle: React.CSSProperties = { fontSize: "13px", fontWeight: "600" };

const scrollContainerStyle: React.CSSProperties = {
  width: "100%",
  overflowX: "auto", // <--- Necesario para móviles
  WebkitOverflowScrolling: "touch"
};

const tableStyle: React.CSSProperties = { width: "100%", borderCollapse: "collapse", minWidth: "600px" };
const tableHeaderRowStyle: React.CSSProperties = { borderBottom: "2px solid var(--border-color)", textAlign: "left" };
const thStyle: React.CSSProperties = { padding: "12px", fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase" };
const rowStyle: React.CSSProperties = { borderBottom: "1px solid var(--border-color)" };
const rowAlertStyle: React.CSSProperties = { borderBottom: "1px solid var(--border-color)", backgroundColor: "rgba(255, 77, 79, 0.05)" };
const tdStyle: React.CSSProperties = { padding: "14px 12px", fontSize: "14px" };

const statusTagStyle: React.CSSProperties = {
  background: "rgba(0,0,0,0.05)",
  padding: "2px 8px",
  borderRadius: "4px",
  fontSize: "11px"
};

const btnStyle: React.CSSProperties = {
  padding: "6px 14px",
  background: "#0b5fff",
  color: "white",
  borderRadius: "8px",
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: "bold"
};

const btnDisabled: React.CSSProperties = {
  padding: "6px 14px",
  background: "var(--border-color)",
  color: "var(--text-muted)",
  borderRadius: "8px",
  fontSize: "14px",
  cursor: "not-allowed"
};