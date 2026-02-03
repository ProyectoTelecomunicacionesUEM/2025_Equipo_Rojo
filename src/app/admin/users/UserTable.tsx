"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { deleteUsersAction, makeAdminsAction, makeUsersAction } from "./actions";
import DarkModeToggle from "@/components/DarkModeToggle";

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
    <div style={{ 
      position: "relative", 
      minHeight: "100vh", 
      backgroundColor: "var(--background)", 
      color: "var(--foreground)",
      transition: "background-color 0.3s ease" 
    }}>
      
      {/* --- Barra superior fija --- */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          left: 0,
          height: 60,
          background: "var(--bg-card)",
          borderBottom: "1px solid var(--border-color)",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          padding: "0 20px",
          zIndex: 1000,
          gap: "15px"
        }}
      >
        <DarkModeToggle />
        
        {session?.user?.email && (
          <span style={{ fontWeight: 600, color: "var(--foreground)" }}>
            {session.user.email}
          </span>
        )}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          style={{
            background: "#0b5fff",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "8px 14px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Cerrar sesión
        </button>
      </div>

      {/* --- Contenido --- */}
      <div style={{ paddingTop: 80, padding: "20px 20px 100px 20px" }}>
        
        {/* Filtros */}
        <form
          action="/admin/users"
          method="get"
          style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20, alignItems: "center" }}
        >
          <input
            type="text"
            name="q"
            placeholder="Buscar por nombre o email"
            defaultValue={q}
            style={{ 
              flex: 2, 
              minWidth: 220, 
              border: "1px solid var(--border-color)", 
              borderRadius: 8, 
              padding: "8px 12px", 
              height: 40,
              background: "var(--bg-card)",
              color: "var(--foreground)"
            }}
          />
          <select
            name="r"
            defaultValue={r}
            style={{ 
              flex: 1, 
              padding: "8px", 
              border: "1px solid var(--border-color)", 
              borderRadius: 8, 
              height: 40,
              background: "var(--bg-card)",
              color: "var(--foreground)"
            }}
          >
            <option value="all">Todos</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
          <button type="submit" style={btnPrimary}>Buscar</button>
          <button
            type="button"
            onClick={() => (window.location.href = "/admin/users")}
            style={{ ...btnGhost, height: 40 }}
          >
            Limpiar filtros
          </button>
        </form>

        {/* Tabla */}
        <div style={{ 
          background: "var(--bg-card)", 
          borderRadius: 12, 
          border: "1px solid var(--border-color)", 
          overflow: "hidden",
          marginBottom: 20
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--background)", borderBottom: "1px solid var(--border-color)" }}>
                <th style={th} />
                <th style={th}>Nombre</th>
                <th style={th}>Email</th>
                <th style={th}>Rol</th>
                <th style={th}>Activo</th>
                <th style={th}>Creado</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>
                    Sin resultados
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
                        borderBottom: "1px solid var(--border-color)" 
                      }}
                    >
                      <td style={{ ...td, width: 42 }}>
                        <input type="checkbox" checked={checked} onChange={(e) => toggleOne(u.id, e.currentTarget.checked)} />
                      </td>
                      <td style={td}>{u.name ?? "—"}</td>
                      <td style={td}>{u.email}</td>
                      <td style={td}>
                        <span style={{
                            padding: "4px 10px",
                            borderRadius: 12,
                            background: u.rol === "admin" ? "var(--primary)" : "var(--background)",
                            color: u.rol === "admin" ? "#000" : "var(--foreground)",
                            fontWeight: 700,
                            fontSize: 11,
                            textTransform: "uppercase"
                        }}>
                          {u.rol}
                        </span>
                      </td>
                      <td style={td}>{u.activo ? "✅" : "❌"}</td>
                      <td style={td}>{d.toLocaleDateString()}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* --- BARRA DE ACCIONES FLOTANTE (STICKY) --- */}
        <form
          style={{
            position: "sticky",
            bottom: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 24px",
            background: "var(--bg-card)",
            borderRadius: 16,
            border: "1px solid var(--border-color)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            zIndex: 900,
            transition: "all 0.3s ease",
            // Solo se ve "potente" si hay seleccionados
            transform: selected.length > 0 ? "scale(1.02)" : "scale(1)",
            visibility: rows.length > 0 ? "visible" : "hidden"
          }}
        >
          <input type="hidden" name="ids" value={idsValue} />
          <div style={{ display: "flex", gap: 10 }}>
            <button 
              type="submit" 
              formAction={runAction("admin")} 
              disabled={!selected.length || pending} 
              style={{ ...btnPrimary, opacity: selected.length ? 1 : 0.4 }}
            >
              Hacer ADMIN
            </button>
            <button 
              type="submit" 
              formAction={runAction("user")} 
              disabled={!selected.length || pending} 
              style={{ ...btnPrimary, opacity: selected.length ? 1 : 0.4 }}
            >
              Hacer USER
            </button>
            <button 
              type="submit" 
              formAction={runAction("delete")} 
              disabled={!selected.length || pending} 
              style={{ ...btnDanger, opacity: selected.length ? 1 : 0.4 }}
            >
              Eliminar
            </button>
          </div>
          <div style={{ color: "var(--foreground)", fontWeight: 700, fontSize: 14 }}>
            {selected.length === 0 ? "Selecciona usuarios" : `🚀 ${selected.length} seleccionados`}
          </div>
        </form>
      </div>
    </div>
  );
}

const th: React.CSSProperties = { padding: "14px 12px", textAlign: "left", fontSize: 13, color: "var(--text-muted)" };
const td: React.CSSProperties = { padding: "14px 12px", fontSize: 14 };
const btnPrimary: React.CSSProperties = { background: "#0b5fff", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", cursor: "pointer", fontWeight: 600 };
const btnGhost: React.CSSProperties = { background: "var(--bg-card)", color: "var(--foreground)", border: "1px solid var(--border-color)", borderRadius: 8, padding: "0 20px", cursor: "pointer", fontWeight: 600 };
const btnDanger: React.CSSProperties = { background: "#ff4d4f", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", cursor: "pointer", fontWeight: 600 };