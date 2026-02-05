"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteUsersAction, makeAdminsAction, makeUsersAction } from "./actions";

type Row = {
  id: string;
  name: string | null;
  email: string;
  rol: "admin" | "user";
  activo: boolean;
  created_at: string | Date;
};

export default function UserTable({
  rows,
  page,
  pageSize,
  q,
  r,
}: {
  rows: Row[];
  page: number;
  pageSize: number;
  q: string;
  r: "all" | "admin" | "user";
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const toggleOne = (id: string, checked: boolean) => {
    setSelected((prev) => (checked ? [...prev, id] : prev.filter((x) => x !== id)));
  };

  useEffect(() => {
    setSelected([]);
  }, [page, pageSize, q, r, rows.length]);

  const idsValue = useMemo(() => JSON.stringify(selected), [selected]);

  const runAction = (kind: "admin" | "user" | "delete") => async () => {
    const formData = new FormData();
    formData.set("ids", idsValue);
    startTransition(async () => {
      try {
        let res;
        if (kind === "admin") res = await makeAdminsAction(formData);
        if (kind === "user") res = await makeUsersAction(formData);
        if (kind === "delete") {
          if (!window.confirm(`¿Seguro que quieres eliminar ${selected.length} usuarios?`)) return;
          res = await deleteUsersAction(formData);
        }
        if (res?.ok) router.refresh();
        else if (res?.message) alert(res.message);
      } catch (e: any) {
        alert(e?.message ?? "Error en la acción");
      }
    });
  };

  return (
    <div style={{ width: "100%" }}>
      <style>{`
        .desktop-only { display: block; }
        .mobile-only { display: none; }

        .filters-form { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 30px; align-items: center; }

        .user-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .desktop-only { display: none; }
          .mobile-only { display: block; }
          
          .filters-form { flex-direction: column; align-items: stretch; }
          .btn-new { margin-left: 0 !important; width: 100%; order: -1; }
          
          .floating-bar { 
            flex-direction: column-reverse !important; 
            gap: 15px; 
            bottom: 0 !important; 
            width: 100% !important; 
            left: 0 !important;
            transform: none !important;
            border-radius: 0 !important; 
            padding: 20px !important;
          }
          .floating-bar > div { width: 100%; flex-direction: column; }
          .floating-bar button { width: 100%; height: 55px !important; font-size: 16px !important; }
        }
      `}</style>

      <div style={{ padding: "0 0 140px 0" }}>
        
        {/* Filtros */}
        <form action="/admin/users" method="get" className="filters-form">
          <input name="q" placeholder="Buscar por nombre o email..." defaultValue={q} style={filterInput} />
          <select name="r" defaultValue={r} style={filterSelect}>
            <option value="all">Todos los roles</option>
            <option value="admin">Administradores</option>
            <option value="user">Usuarios</option>
          </select>
          <div style={{ display: "flex", gap: 10 }}>
            <button type="submit" style={{...btnPrimary, flex: 1}}>Buscar</button>
            <button type="button" onClick={() => (window.location.href = "/admin/users")} style={{...btnGhost, flex: 1}}>Limpiar</button>
          </div>
          <button type="button" onClick={() => router.push("/admin/users/new")} style={btnNewUser} className="btn-new">
            + Nuevo Usuario
          </button>
        </form>

        {/* --- VISTA DESKTOP (TABLA) --- */}
        <div className="desktop-only" style={tableContainer}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--background)", borderBottom: "2px solid var(--border-color)" }}>
                <th style={th} />
                <th style={th}>Nombre</th>
                <th style={th}>Email</th>
                <th style={th}>Rol</th>
                <th style={th}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((u) => (
                <tr key={u.id} style={{ borderBottom: "1px solid var(--border-color)", background: selected.includes(u.id) ? "var(--row-hover)" : "transparent" }}>
                  <td style={{ ...td, textAlign: "center" }}>
                    <input 
                        type="checkbox" 
                        checked={selected.includes(u.id)} 
                        onChange={(e) => toggleOne(u.id, e.target.checked)} 
                        style={{ width: 18, height: 18, cursor: "pointer" }}
                    />
                  </td>
                  <td style={{ ...td, fontWeight: 700 }}>{u.name ?? "—"}</td>
                  <td style={td}>{u.email}</td>
                  <td style={td}>
                    <span style={badgeStyle(u.rol)}>
                      {u.rol === "admin" ? "Administrador" : "Usuario"}
                    </span>
                  </td>
                  <td style={{ ...td, fontSize: "22px" }}>{u.activo ? "✅" : "❌"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- VISTA MÓVIL (CARDS) --- */}
        <div className="mobile-only">
          {rows.length === 0 ? (
              <div style={{ textAlign: "center", padding: 40, color: "var(--text-muted)", fontSize: "18px" }}>No se encontraron usuarios</div>
          ) : (
            rows.map((u) => (
              <div key={u.id} className="user-card" onClick={() => toggleOne(u.id, !selected.includes(u.id))} style={{ borderLeft: selected.includes(u.id) ? "6px solid #0b5fff" : "1px solid var(--border-color)", padding: "20px" }}>
                <input 
                  type="checkbox" 
                  checked={selected.includes(u.id)} 
                  onChange={() => {}} 
                  style={{ width: 24, height: 24 }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: "18px", color: "var(--foreground)" }}>{u.name || "Sin nombre"}</div>
                  <div style={{ fontSize: "15px", color: "var(--text-muted)", marginBottom: 10 }}>{u.email}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={badgeStyle(u.rol)}>
                      {u.rol === "admin" ? "Administrador" : "Usuario"}
                    </span>
                    <span style={{ fontSize: "15px", fontWeight: 600 }}>{u.activo ? "✅ Activo" : "❌ Inactivo"}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Barra Flotante de Acciones */}
        {selected.length > 0 && (
          <div className="floating-bar" style={floatingBarStyle}>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={runAction("admin")} disabled={pending} style={btnBigAction}>Hacer Admin</button>
              <button onClick={runAction("user")} disabled={pending} style={btnBigAction}>Hacer Usuario</button>
              <button onClick={runAction("delete")} disabled={pending} style={{ ...btnBigAction, background: "#ef4444" }}>Eliminar</button>
            </div>
            <div style={{ fontWeight: 900, fontSize: "18px", color: "var(--foreground)", whiteSpace: "nowrap" }}>
                {selected.length} <span style={{ fontWeight: 400, fontSize: "14px" }}>seleccionados</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Estilos Ajustados (Más grandes)
const th: React.CSSProperties = { padding: "20px 15px", textAlign: "left", fontSize: "14px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 800 };
const td: React.CSSProperties = { padding: "20px 15px", fontSize: "16px", color: "var(--foreground)" };
const tableContainer = { background: "var(--bg-card)", borderRadius: 20, border: "1px solid var(--border-color)", overflow: "hidden" };
const filterInput: React.CSSProperties = { flex: 2, minWidth: 200, border: "1px solid var(--border-color)", borderRadius: 12, padding: "0 18px", height: 52, background: "var(--bg-card)", color: "var(--foreground)", fontSize: "16px" };
const filterSelect: React.CSSProperties = { ...filterInput, flex: 1 };
const btnPrimary = { background: "#0b5fff", color: "#fff", border: "none", borderRadius: 12, padding: "0 25px", height: 52, cursor: "pointer", fontWeight: 800, fontSize: "16px" };
const btnGhost = { ...btnPrimary, background: "transparent", color: "var(--foreground)", border: "1px solid var(--border-color)" };
const btnNewUser = { ...btnPrimary, background: "#10b981", marginLeft: "auto" };

// Botones de la barra flotante (Más grandes)
const btnBigAction = { ...btnPrimary, height: 48, padding: "0 18px", fontSize: "14px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" };

const floatingBarStyle: React.CSSProperties = {
  position: "fixed", bottom: "30px", left: "50%", transform: "translateX(-50%)",
  width: "95%", maxWidth: "850px", background: "var(--bg-card)", padding: "20px 35px",
  borderRadius: "24px", border: "1px solid var(--border-color)", boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
  display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 1000
};

const badgeStyle = (rol: string) => ({
  padding: "6px 14px", borderRadius: "12px", fontSize: "12px", fontWeight: 800, 
  background: rol === "admin" ? "#0b5fff22" : "rgba(0,0,0,0.05)",
  color: rol === "admin" ? "#0b5fff" : "var(--foreground)",
  border: rol === "admin" ? "1px solid #0b5fff44" : "1px solid transparent"
});