import { pool } from "@/lib/db";
import Link from "next/link";
import UserTable from "./UserTable";
import type { CSSProperties } from "react";

export const dynamic = "force-dynamic";

interface UserRow {
  id: string;
  name: string;
  email: string;
  rol: "admin" | "user";
  activo: boolean;
  created_at: Date;
  total_count: number;
}

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function AdminUsersPage(props: {
  searchParams: SearchParams;
}) {
  const sParams = await props.searchParams;
  const PAGE_SIZE = 10;
  
  const page = typeof sParams.page === "string" ? sParams.page : "1";
  const q = typeof sParams.q === "string" ? sParams.q : "";
  const r = typeof sParams.r === "string" ? sParams.r : "all";

  const pageNum = Math.max(1, parseInt(page) || 1);
  const offset = (pageNum - 1) * PAGE_SIZE;
  const roleFilter = (r === "admin" || r === "user") ? r : "all";
  const searchQ = q.trim();

  // Queries
  const { rows: countsRows } = await pool.query<{ rol: string; c: number }>(
    `SELECT rol, COUNT(*)::int AS c FROM public.subscribers GROUP BY rol`
  );
  const countAdmin = countsRows.find(x => x.rol === "admin")?.c ?? 0;
  const countUser = countsRows.find(x => x.rol === "user")?.c ?? 0;
  const countAll = countAdmin + countUser;

  const where: string[] = [];
  const args: any[] = [];
  if (roleFilter !== "all") { args.push(roleFilter); where.push(`rol = $${args.length}`); }
  if (searchQ) { args.push(`%${searchQ}%`); where.push(`(email ILIKE $${args.length} OR name ILIKE $${args.length})`); }

  const whereSql = where.length > 0 ? `WHERE ${where.join(" AND ")}` : "";
  const dataSql = `
    SELECT id, name, email, rol, activo, created_at, COUNT(*) OVER()::int AS total_count
    FROM public.subscribers
    ${whereSql}
    ORDER BY created_at DESC
    LIMIT $${args.length + 1} OFFSET $${args.length + 2}
  `;

  const { rows } = await pool.query<UserRow>(dataSql, [...args, PAGE_SIZE, offset]);
  const totalCount = rows[0]?.total_count ?? 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1;

  const createQueryString = (overrides: Record<string, string | number | null>) => {
    const params = new URLSearchParams();
    params.set("page", String(pageNum));
    if (searchQ) params.set("q", searchQ);
    if (roleFilter !== "all") params.set("r", roleFilter);
    Object.entries(overrides).forEach(([k, v]) => v === null ? params.delete(k) : params.set(k, String(v)));
    return `/admin/users?${params.toString()}`;
  };

  return (
    <main style={{ padding: "12px 20px", maxWidth: "1200px", margin: "0 auto", fontFamily: "system-ui, sans-serif" }}>
      <header style={{ marginBottom: "12px" }}>
        <h2 style={{ margin: 0, fontSize: "1.4rem" }}>Usuarios ({totalCount})</h2>
      </header>

      {/* Filtros */}
      <nav style={{ display: "flex", gap: "6px", marginBottom: "12px" }}>
       
      </nav>

      {/* Bloque Unificado de Tabla + Paginación */}
      <div style={unifiedContainer}>
        {/* Aquí es donde controlas la altura máxima */}
        <div style={{ overflowX: "auto", overflowY: "auto", maxHeight: "750px" }}>
          <UserTable rows={rows} page={pageNum} pageSize={PAGE_SIZE} q={searchQ} r={roleFilter} />
        </div>

        {/* Paginación pegada a la tabla */}
        <footer style={compactFooter}>
          <span style={{ fontSize: "12px", color: "#666" }}>
            {rows.length} usuarios en esta página
          </span>
          
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <Link 
              href={createQueryString({ page: pageNum - 1 })} 
              style={pageNum <= 1 ? btnDisabled : pageBtn}
            >
              Anterior
            </Link>
            
            <span style={{ fontSize: "13px", fontWeight: "600" }}>
              {pageNum} / {totalPages}
            </span>

            <Link 
              href={createQueryString({ page: pageNum + 1 })} 
              style={pageNum >= totalPages ? btnDisabled : pageBtn}
            >
              Siguiente
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}

// --- Estilos Corregidos y Compactos ---
const unifiedContainer: CSSProperties = {
  backgroundColor: "#fff",
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "#e0e0e0",
  borderRadius: "8px",
  overflow: "hidden", // Importante para que el footer no se salga de las esquinas redondeadas
};

const compactFooter: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "8px 12px",
  backgroundColor: "#f9fafb",
  borderTopWidth: "1px",
  borderTopStyle: "solid",
  borderTopColor: "#eee",
};

const baseTab: CSSProperties = {
  padding: "6px 12px",
  borderRadius: "6px",
  textDecoration: "none",
  fontSize: "13px",
  borderWidth: "1px",
  borderStyle: "solid",
};

const tab: CSSProperties = { ...baseTab, color: "#555", backgroundColor: "#fff", borderColor: "#e0e0e0" };
const tabActive: CSSProperties = { ...baseTab, backgroundColor: "#000", color: "#fff", borderColor: "#000" };

const pageBtn: CSSProperties = { 
  ...baseTab, 
  backgroundColor: "#fff", 
  borderColor: "#ccc", 
  color: "#333",
  padding: "4px 10px",
  fontSize: "12px" 
};

const btnDisabled: CSSProperties = { 
  ...pageBtn, 
  opacity: 0.3, 
  pointerEvents: "none", 
  borderColor: "transparent"
};