// src/app/admin/users/page.tsx
import { pool } from "@/lib/db";
import Link from "next/link";
import UserTable from "./UserTable";

export const dynamic = "force-dynamic";

type SearchParams = {
  page?: string;
  pageSize?: string;
  q?: string;
  r?: "all" | "admin" | "user";
};

export default async function AdminUsersPage({ searchParams }: { searchParams: any }) {
  const params = await searchParams;
  const { page = "1", pageSize = "10", q = "", r = "all" } = params;

  const pageNum = Math.max(1, Number(page) || 1);
  const take = Math.min(50, Math.max(5, Number(pageSize) || 10));
  const offset = (pageNum - 1) * take;

  const qStr = (q || "").trim();
  const roleFilter = r === "admin" || r === "user" ? r : "all";

  // ---- Contadores por rol ----
  const countsSql = `
    SELECT rol, COUNT(*)::int AS c
    FROM public.subscribers
    GROUP BY rol
  `;
  const { rows: countsRows } = await pool.query(countsSql);
  const countAdmin = countsRows.find((x: any) => x.rol === "admin")?.c ?? 0;
  const countUser = countsRows.find((x: any) => x.rol === "user")?.c ?? 0;
  const countAll = countAdmin + countUser;

  // ---- Datos ----
  let dataSql = `
    SELECT id, name, email, rol, activo, created_at
    FROM public.subscribers
  `;
  let dataParams: any[] = [];

  if (roleFilter !== "all" && qStr.length > 0) {
    dataSql += ` WHERE (email ILIKE $1 OR name ILIKE $1) AND rol = $2 ORDER BY created_at DESC LIMIT $3 OFFSET $4`;
    dataParams = [`%${qStr}%`, roleFilter, take, offset];
  } else if (roleFilter !== "all") {
    dataSql += ` WHERE rol = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`;
    dataParams = [roleFilter, take, offset];
  } else if (qStr.length > 0) {
    dataSql += ` WHERE email ILIKE $1 OR name ILIKE $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`;
    dataParams = [`%${qStr}%`, take, offset];
  } else {
    dataSql += ` ORDER BY created_at DESC LIMIT $1 OFFSET $2`;
    dataParams = [take, offset];
  }

  const { rows } = await pool.query(dataSql, dataParams);
  const totalPages = Math.max(1, Math.ceil(rows.length / take));

  const keepQS = (extra: Record<string, string | number>) => {
    const params = new URLSearchParams({
      page: String(pageNum),
      pageSize: String(take),
      ...(qStr ? { q: qStr } : {}),
      ...(roleFilter !== "all" ? { r: roleFilter } : {}),
      ...Object.fromEntries(Object.entries(extra).map(([k, v]) => [k, String(v)])),
    });
    return `/admin/users?${params.toString()}`;
  };

  const tabLink = (tab: "all" | "admin" | "user") => {
    const params = new URLSearchParams({
      page: "1",
      pageSize: String(take),
      ...(qStr ? { q: qStr } : {}),
      ...(tab !== "all" ? { r: tab } : {}),
    });
    return `/admin/users?${params.toString()}`;
  };

  return (
    <main style={{ padding: 24 }}>
      <h2>Usuarios (Admin)</h2>

      {/* Tabs por rol */}
      <div style={{ display: "flex", gap: 8, margin: "8px 0 12px" }}>
        <Link href={tabLink("all")} style={roleFilter === "all" ? tabActive : tab}>
          Todos ({countAll})
        </Link>
        <Link href={tabLink("admin")} style={roleFilter === "admin" ? tabActive : tab}>
          Admin ({countAdmin})
        </Link>
        <Link href={tabLink("user")} style={roleFilter === "user" ? tabActive : tab}>
          User ({countUser})
        </Link>
      </div>

      {/* Buscador: input + combo + botón en la misma línea */}
      <form
        action="/admin/users"
        method="get"
        style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}
      >
        <input
          type="text"
          name="q"
          placeholder="Buscar por nombre o email"
          defaultValue={qStr}
          style={{
            flex: 2,
            minWidth: 220,
            border: "1px solid #ddd",
            borderRadius: 6,
            padding: "6px 10px",
            height: 36,
          }}
        />

        <select
          name="r"
          defaultValue={roleFilter}
          style={{
            flex: 1,
            padding: "6px 10px",
            border: "1px solid #ddd",
            borderRadius: 6,
            height: 36,
          }}
        >
          <option value="all">Todos</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>

        <button
          type="submit"
          style={{
            flex: 1,
            background: "#0b5fff",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "8px 12px",
            height: 36,
          }}
        >
          Buscar
        </button>
      </form>

      {/* Tabla de usuarios */}
      <UserTable rows={rows as any} page={pageNum} pageSize={take} q={qStr} r={roleFilter} />

      {/* Paginación */}
      {totalPages > 1 && (
        <nav
          style={{
            marginTop: 12,
            display: "flex",
            gap: 8,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Link href={keepQS({ page: pageNum - 1 })} style={pageBtn}>
            « Anterior
          </Link>
          <span>Página {pageNum} de {totalPages}</span>
          <Link href={keepQS({ page: pageNum + 1 })} style={pageBtn}>
            Siguiente »
          </Link>
        </nav>
      )}

      <p style={{ marginTop: 20 }}>
        <Link href="/admin">⬅ Volver al panel</Link>
      </p>
    </main>
  );
}

const tab: React.CSSProperties = {
  padding: "6px 10px",
  border: "1px solid #ddd",
  borderRadius: 6,
  textDecoration: "none",
  color: "#333",
};

const tabActive: React.CSSProperties = {
  ...tab,
  background: "#0b5fff",
  color: "#fff",
  borderColor: "#0b5fff",
};

const pageBtn: React.CSSProperties = {
  padding: "6px 10px",
  border: "1px solid #ddd",
  borderRadius: 6,
  textDecoration: "none",
  color: "#333",
};
