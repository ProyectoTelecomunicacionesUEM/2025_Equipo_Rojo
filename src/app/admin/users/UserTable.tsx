"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
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
  const { data: session } = useSession();

  const toggleOne = (id: string, checked: boolean) => {
    setSelected((prev) => (checked ? [...prev, id] : prev.filter((x) => x !== id)));
  };

  useEffect(() => {
    setSelected([]);
  }, [page, pageSize, q, r, rows.length]);

  const idsValue = useMemo(() => JSON.stringify(selected), [selected]);

  const runAction =
    (kind: "admin" | "user" | "delete") =>
    async (formData: FormData) => {
      formData.set("ids", idsValue);
      startTransition(async () => {
        try {
          let res;
          if (kind === "admin") res = await makeAdminsAction(formData);
          if (kind === "user") res = await makeUsersAction(formData);
          if (kind === "delete") {
            const ok = window.confirm("¿Seguro que quieres eliminar los seleccionados?");
            if (!ok) return;
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
    /* 1. QUITAMOS el div de pantalla completa (minHeight, position relative, etc) */
    <div style={{ width: "100%" }}>
      
      {/* 2. BORRADA LA BARRA SUPERIOR (Ya la pone el Layout) */}

      {/* 3. CONTENIDO: Quitamos el padding excesivo y el paddingTop de 90px */}
      <div style={{ padding: "0 0 120px 0" }}>
        
        {/* Filtros */}
        <form
          action="/admin/users"
          method="get"
          style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 30, alignItems: "center" }}
        >
          <input
            type="text"
            name="q"
            placeholder="Buscar por nombre o email"
            defaultValue={q}
            style={filterInput}
          />
          <select
            name="r"
            defaultValue={r}
            style={filterSelect}
          >
            <option value="all">Todos los roles</option>
            <option value="admin">Administradores</option>
            <option value="user">Usuarios</option>
          </select>
          <button type="submit" style={btnPrimary}>Buscar ahora</button>
          <button
            type="button"
            onClick={() => (window.location.href = "/admin/users")}
            style={btnGhost}
          >
            Limpiar filtros
          </button>
          
          <button
            type="button"
            onClick={() => router.push("/admin/users/new")}
            style={btnNewUser}
          >
            + Nuevo Usuario
          </button>
        </form>

        {/* Tabla */}
        <div style={tableContainer}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--background)", borderBottom: "2px solid var(--border-color)" }}>
                <th style={th} />
                <th style={th}>Nombre completo</th>
                <th style={th}>Correo electrónico</th>
                <th style={th}>Rol</th>
                <th style={th}>Estado</th>
                <th style={th}>Fecha de registro</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: 60, color: "var(--text-muted)", fontSize: "20px" }}>
                    No se encontraron resultados
                  </td>
                </tr>
              ) : (
                rows.map((u) => {
                  const checked = selected.includes(u.id);
                  const d = typeof u.created_at === "string" ? new Date(u.created_at) : u.created_at;

                  return (
                    <tr 
                      key={u.id} 
                      style={{ 
                        background: checked ? "var(--row-hover)" : "transparent",
                        borderBottom: "1px solid var(--border-color)",
                        transition: "background 0.2s"
                      }}
                    >
                      <td style={{ ...td, width: 50, textAlign: "center" }}>
                        <input 
                          type="checkbox" 
                          style={{ width: 18, height: 18, cursor: "pointer" }}
                          checked={checked} 
                          onChange={(e) => toggleOne(u.id, e.currentTarget.checked)} 
                        />
                      </td>
                      <td style={{ ...td, fontWeight: 600 }}>{u.name ?? "—"}</td>
                      <td style={td}>{u.email}</td>
                      <td style={td}>
                        <span style={{
                            padding: "4px 12px",
                            borderRadius: 20,
                            background: u.rol === "admin" ? "var(--primary)" : "rgba(0,0,0,0.05)",
                            color: u.rol === "admin" ? "#000" : "var(--foreground)",
                            fontWeight: 700,
                            fontSize: 11,
                            textTransform: "uppercase"
                        }}>
                          {u.rol}
                        </span>
                      </td>
                      <td style={{ ...td, fontSize: "18px" }}>{u.activo ? "✅" : "❌"}</td>
                      <td style={td}>{d.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* BARRA DE ACCIONES FLOTANTE */}
        {selected.length > 0 && (
          <form
            style={floatingActions}
          >
            <input type="hidden" name="ids" value={idsValue} />
            <div style={{ display: "flex", gap: 15 }}>
              <button type="submit" formAction={runAction("admin")} disabled={pending} style={{ ...btnAction, background: "#0b5fff" }}>
                Hacer ADMIN
              </button>
              <button type="submit" formAction={runAction("user")} disabled={pending} style={{ ...btnAction, background: "#0b5fff" }}>
                Hacer USER
              </button>
              <button type="submit" formAction={runAction("delete")} disabled={pending} style={{ ...btnAction, background: "#ff4d4f" }}>
                Eliminar
              </button>
            </div>
            <div style={{ color: "var(--foreground)", fontWeight: 800, fontSize: "18px" }}>
              🔥 {selected.length} seleccionados
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ESTILOS LIMPIOS
const tableContainer: React.CSSProperties = { 
  background: "var(--bg-card)", 
  borderRadius: 16, 
  border: "1px solid var(--border-color)", 
  overflow: "hidden",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
};

const th: React.CSSProperties = { padding: "18px 15px", textAlign: "left", fontSize: "13px", color: "var(--text-muted)", textTransform: "uppercase" };
const td: React.CSSProperties = { padding: "16px 15px", fontSize: "15px" };

const filterInput: React.CSSProperties = { flex: 2, minWidth: 250, border: "1px solid var(--border-color)", borderRadius: 10, padding: "0 15px", height: 48, fontSize: "16px", background: "var(--bg-card)", color: "var(--foreground)" };
const filterSelect: React.CSSProperties = { flex: 1, padding: "0 10px", border: "1px solid var(--border-color)", borderRadius: 10, height: 48, fontSize: "16px", background: "var(--bg-card)", color: "var(--foreground)" };

const btnPrimary: React.CSSProperties = { background: "#0b5fff", color: "#fff", border: "none", borderRadius: 10, padding: "0 25px", height: 48, cursor: "pointer", fontWeight: 700 };
const btnGhost: React.CSSProperties = { background: "transparent", color: "var(--foreground)", border: "2px solid var(--border-color)", borderRadius: 10, padding: "0 20px", height: 48, cursor: "pointer", fontWeight: 700 };
const btnNewUser: React.CSSProperties = { background: "var(--primary)", color: "#000", border: "none", borderRadius: 10, padding: "0 25px", height: 48, cursor: "pointer", fontWeight: 700, marginLeft: "auto" };
const btnAction: React.CSSProperties = { color: "#fff", border: "none", borderRadius: 12, padding: "12px 24px", cursor: "pointer", fontWeight: 700 };

const floatingActions: React.CSSProperties = {
  position: "fixed",
  bottom: "30px",
  left: "50%",
  transform: "translateX(-20%)", // Ajustado para que no choque con la sidebar
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "600px",
  padding: "20px 30px",
  background: "var(--bg-card)",
  borderRadius: "20px",
  border: "1px solid var(--border-color)",
  boxShadow: "0 15px 40px rgba(0,0,0,0.25)",
  zIndex: 900
};