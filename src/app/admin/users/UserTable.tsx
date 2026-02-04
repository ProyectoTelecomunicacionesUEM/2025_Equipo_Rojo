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
            flex-direction: column !important; 
            gap: 15px; 
            bottom: 0 !important; 
            width: 100% !important; 
            left: 0 !important;
            transform: none !important;
            border-radius: 0 !important; 
          }
        }
      `}</style>

      <div style={{ padding: "0 0 120px 0" }}>
        
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
                    <input type="checkbox" checked={selected.includes(u.id)} onChange={(e) => toggleOne(u.id, e.target.checked)} />
                  </td>
                  <td style={{ ...td, fontWeight: 600 }}>{u.name ?? "—"}</td>
                  <td style={td}>{u.email}</td>
                  <td style={td}>
                    <span style={badgeStyle(u.rol)}>
                      {u.rol === "admin" ? "Administrador" : "Usuario"}
                    </span>
                  </td>
                  <td style={{ ...td, fontSize: "18px" }}>{u.activo ? "✅" : "❌"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- VISTA MÓVIL (CARDS) --- */}
        <div className="mobile-only">
          {rows.length === 0 ? (
             <div style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>No se encontraron usuarios</div>
          ) : (
            rows.map((u) => (
              <div key={u.id} className="user-card" onClick={() => toggleOne(u.id, !selected.includes(u.id))} style={{ borderLeft: selected.includes(u.id) ? "4px solid #0b5fff" : "1px solid var(--border-color)" }}>
                <input 
                  type="checkbox" 
                  checked={selected.includes(u.id)} 
                  onChange={() => {}} 
                  style={{ width: 20, height: 20 }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: "16px", color: "var(--foreground)" }}>{u.name || "Sin nombre"}</div>
                  <div style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: 8 }}>{u.email}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={badgeStyle(u.rol)}>
                      {u.rol === "admin" ? "Administrador" : "Usuario"}
                    </span>
                    <span>{u.activo ? "✅ Activo" : "❌ Inactivo"}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Barra Flotante de Acciones */}
        {selected.length > 0 && (
          <div className="floating-bar" style={floatingBarStyle}>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={runAction("admin")} disabled={pending} style={btnSmall}>Hacer Administrador</button>
              <button onClick={runAction("user")} disabled={pending} style={btnSmall}>Hacer Usuario</button>
              <button onClick={runAction("delete")} disabled={pending} style={{ ...btnSmall, background: "#ff4d4f" }}>Eliminar</button>
            </div>
            <div style={{ fontWeight: 800, color: "var(--foreground)" }}>{selected.length} seleccionados</div>
          </div>
        )}
      </div>
    </div>
  );
}

// Estilos
const th: React.CSSProperties = { padding: "18px 15px", textAlign: "left", fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase" };
const td: React.CSSProperties = { padding: "16px 15px", fontSize: "14px", color: "var(--foreground)" };
const tableContainer = { background: "var(--bg-card)", borderRadius: 16, border: "1px solid var(--border-color)", overflow: "hidden" };
const filterInput: React.CSSProperties = { flex: 2, minWidth: 200, border: "1px solid var(--border-color)", borderRadius: 10, padding: "0 15px", height: 48, background: "var(--bg-card)", color: "var(--foreground)" };
const filterSelect: React.CSSProperties = { flex: 1, border: "1px solid var(--border-color)", borderRadius: 10, padding: "0 10px", height: 48, background: "var(--bg-card)", color: "var(--foreground)" };
const btnPrimary = { background: "#0b5fff", color: "#fff", border: "none", borderRadius: 10, padding: "0 20px", height: 48, cursor: "pointer", fontWeight: 700 };
const btnGhost = { ...btnPrimary, background: "transparent", color: "var(--foreground)", border: "1px solid var(--border-color)" };
const btnNewUser = { ...btnPrimary, background: "#10b981", marginLeft: "auto" };
const btnSmall = { ...btnPrimary, height: 40, padding: "0 12px", fontSize: "12px" };

const floatingBarStyle: React.CSSProperties = {
  position: "fixed", bottom: "20px", left: "50%", transform: "translateX(-50%)",
  width: "90%", maxWidth: "700px", background: "var(--bg-card)", padding: "15px 25px",
  borderRadius: "20px", border: "1px solid var(--border-color)", boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 1000
};

const badgeStyle = (rol: string) => ({
  padding: "4px 10px", borderRadius: "10px", fontSize: "11px", fontWeight: 700, 
  background: rol === "admin" ? "var(--primary)" : "rgba(0,0,0,0.05)",
  color: rol === "admin" ? "#000" : "var(--foreground)"
});