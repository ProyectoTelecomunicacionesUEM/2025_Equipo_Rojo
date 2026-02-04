import { pool } from "@/lib/db";
import Link from "next/link";
import UserTable from "./UserTable";
import { CSSProperties } from "react";

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

  const { rows: countsRows } = await pool.query<{ rol: string; c: number }>(
    `SELECT rol, COUNT(*)::int AS c FROM public.subscribers GROUP BY rol`
  );

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
    /* HE QUITADO:
       1. La etiqueta <main> (Ya está en el Layout)
       2. El <header> con estilos de color (Ya está en el Layout)
       3. El botón de cerrar sesión y el email (Ya están en el Layout)
    */
    <div style={{ width: "100%", padding: "0" }}>
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ margin: 0, fontSize: "1.8rem", fontWeight: "bold" }}>
          Usuarios ({totalCount})
        </h2>
      </div>

      <div style={unifiedContainer}>
        <div style={{ overflowX: "auto" }}>
          <UserTable rows={rows} page={pageNum} pageSize={PAGE_SIZE} q={searchQ} r={roleFilter} />
        </div>

        <footer style={compactFooter}>
          <span style={{ fontSize: "13px", color: "#666" }}>
            {rows.length} usuarios mostrados
          </span>
          
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <Link 
              href={createQueryString({ page: pageNum - 1 })} 
              style={pageNum <= 1 ? btnDisabled : pageBtn}
            >
              Anterior
            </Link>
            
            <span style={{ fontSize: "13px", fontWeight: "700" }}>
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
    </div>
  );
}

// Estilos que NO chocan con el Layout
const unifiedContainer: CSSProperties = {
  backgroundColor: "var(--bg-card)",
  borderRadius: "12px",
  border: "1px solid var(--border-color)",
  overflow: "hidden",
};

const compactFooter: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 20px",
  backgroundColor: "rgba(0,0,0,0.02)",
  borderTop: "1px solid var(--border-color)",
};

const pageBtn: CSSProperties = { 
  padding: "6px 14px", 
  backgroundColor: "#fff", 
  border: "1px solid #ddd", 
  borderRadius: "6px", 
  color: "#333", 
  textDecoration: "none", 
  fontSize: "12px",
  fontWeight: "bold"
};

const btnDisabled: CSSProperties = { 
  ...pageBtn, 
  opacity: 0.4, 
  pointerEvents: "none",
  backgroundColor: "#f5f5f5"
};