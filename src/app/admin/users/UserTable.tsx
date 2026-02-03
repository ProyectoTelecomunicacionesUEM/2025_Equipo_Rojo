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
    <div style={{ border: "1px solid #eee", borderRadius: 8, overflow: "hidden", padding: 12 }}>
      {/* --- Buscador y filtros --- */}
      <form
        action="/admin/users"
        method="get"
        style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12, alignItems: "center" }}
      >
        <input
          type="text"
          name="q"
          placeholder="Buscar por nombre o email"
          defaultValue={q}
          style={{ flex: 2, minWidth: 220, border: "1px solid #ddd", borderRadius: 6, padding: "6px 10px", height: 36 }}
        />

        <select
          name="r"
          defaultValue={r}
          style={{ flex: 1, padding: "6px 10px", border: "1px solid #ddd", borderRadius: 6, height: 36 }}
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
            cursor: "pointer",
          }}
        >
          Buscar
        </button>

        <button
          type="button"
          onClick={() => (window.location.href = "/admin/users")}
          style={{
            flex: 1,
            background: "#0b5fff",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "8px 12px",
            height: 36,
            cursor: "pointer",
          }}
        >
          Limpiar filtros
        </button>
      </form>

      {/* --- Tabla --- */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12 }}>
        <thead>
          <tr>
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
              <td colSpan={6} style={{ textAlign: "center", padding: 24, color: "#999" }}>
                Sin resultados
              </td>
            </tr>
          ) : (
            rows.map((u) => {
              const checked = selected.includes(u.id);
              const d = typeof u.created_at === "string" ? new Date(u.created_at) : u.created_at;
              return (
                <tr key={u.id} style={checked ? { background: "#f7faff" } : undefined}>
                  <td style={{ ...td, width: 42 }}>
                    <input
                      type="checkbox"
                      aria-label={`Seleccionar ${u.email}`}
                      checked={checked}
                      onChange={(e) => toggleOne(u.id, e.currentTarget.checked)}
                    />
                  </td>
                  <td style={td}>{u.name ?? "—"}</td>
                  <td style={td}>{u.email}</td>
                  <td style={td}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "2px 8px",
                        borderRadius: 12,
                        background: u.rol === "admin" ? "#e8f0ff" : "#f1f1f1",
                        color: u.rol === "admin" ? "#0b5fff" : "#444",
                        fontWeight: 600,
                        fontSize: 12,
                      }}
                    >
                      {u.rol}
                    </span>
                  </td>
                  <td style={td}>{u.activo ? "Sí" : "No"}</td>
                  <td style={td}>{d.toLocaleDateString()}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* --- Botones debajo de la tabla --- */}
      <form style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center", padding: 12 }}>
        <input type="hidden" name="ids" value={idsValue} />
        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit" formAction={runAction("admin")} disabled={!selected.length || pending} style={btn}>
            Hacer ADMIN
          </button>
          <button type="submit" formAction={runAction("user")} disabled={!selected.length || pending} style={btn}>
            Hacer USER
          </button>
          <button type="submit" formAction={runAction("delete")} disabled={!selected.length || pending} style={btnDanger}>
            Eliminar
          </button>
        </div>
        <div style={{ color: "#666" }}>{selected.length ? `${selected.length} seleccionados` : "Nada seleccionado"}</div>
      </form>
    </div>
  );
}

const th: React.CSSProperties = { borderBottom: "1px solid #f0f0f0", padding: 10, textAlign: "left" };
const td: React.CSSProperties = { borderBottom: "1px solid #f8f8f8", padding: 10 };

const btn: React.CSSProperties = {
  background: "#0b5fff",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  padding: "8px 12px",
  cursor: "pointer",
};

const btnDanger: React.CSSProperties = {
  background: "#e53935",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  padding: "8px 12px",
  cursor: "pointer",
};
