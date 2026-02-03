"use server";

import { pool } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs"; // <--- Importamos bcrypt

/** Requiere que el usuario sea admin */
async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error("No autorizado (sin sesión)");
  }

  const email = session.user.email;

  const { rows } = await pool.query(
    `SELECT id, rol FROM public.subscribers WHERE email = $1 LIMIT 1`,
    [email]
  );

  const dbUser = rows[0];
  if (!dbUser) throw new Error("No autorizado (usuario no existe)");
  if ((dbUser.rol ?? "").trim() !== "admin")
    throw new Error("No autorizado (no eres admin)");

  return { id: dbUser.id as string, email, role: "admin" as const };
}

/** Lee ids JSON del formData */
function parseIds(formData: FormData): string[] {
  const raw = formData.get("ids");
  if (!raw || typeof raw !== "string") return [];
  try {
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter(Boolean) : [];
  } catch {
    return [];
  }
}

/** Evita dejar el sistema sin administradores */
async function ensureAtLeastOneAdminRemains(client: any, idsToAffect: string[]) {
  const { rows: totalAdminsRows } = await client.query(
    `SELECT COUNT(*)::int AS c FROM public.subscribers WHERE rol = 'admin'`
  );
  const totalAdmins = totalAdminsRows[0]?.c ?? 0;

  const { rows: affectedAdminsRows } = await client.query(
    `SELECT COUNT(*)::int AS c 
       FROM public.subscribers 
      WHERE id = ANY($1::uuid[]) AND rol = 'admin'`,
    [idsToAffect]
  );
  const affectedAdmins = affectedAdminsRows[0]?.c ?? 0;

  if (affectedAdmins >= totalAdmins) {
    throw new Error("No puedes dejar el sistema sin administradores.");
  }
}

/** Acción: Crear un nuevo usuario */
export async function createUserAction(formData: FormData) {
  await requireAdmin();

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string; // <--- Capturamos la clave
  const rol = (formData.get("rol") as string) || "user";

  // Validamos que la clave no venga vacía
  if (!email || !name || !password) {
    return { ok: false, message: "Nombre, email y contraseña son obligatorios" };
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Verificar si el email ya existe
    const { rows: existing } = await client.query(
      `SELECT id FROM public.subscribers WHERE email = $1 LIMIT 1`,
      [email]
    );

    if (existing.length > 0) {
      throw new Error("El correo electrónico ya está registrado.");
    }

    // --- SEGURIDAD: Hasheamos la contraseña antes de insertar ---
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insertar nuevo registro incluyendo la columna password
    await client.query(
      `INSERT INTO public.subscribers (name, email, rol, activo, password, created_at) 
       VALUES ($1, $2, $3, true, $4, NOW())`,
      [name, email, rol, hashedPassword]
    );

    await client.query("COMMIT");
  } catch (e: any) {
    await client.query("ROLLBACK");
    return { ok: false, message: e.message || "Error al crear usuario" };
  } finally {
    client.release();
  }

  revalidatePath("/admin/users");
  return { ok: true, message: "Usuario creado con éxito" };
}

/** Acción: cambiar seleccionados a ADMIN */
export async function makeAdminsAction(formData: FormData) {
  await requireAdmin();
  const ids = parseIds(formData);
  if (!ids.length) return { ok: false, message: "Sin selección" };

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      `UPDATE public.subscribers SET rol = 'admin' WHERE id = ANY($1::uuid[])`,
      [ids]
    );
    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }

  revalidatePath("/admin/users");
  return { ok: true, message: "Cambiados a admin" };
}

/** Acción: cambiar seleccionados a USER */
export async function makeUsersAction(formData: FormData) {
  await requireAdmin();
  const ids = parseIds(formData);
  if (!ids.length) return { ok: false, message: "Sin selección" };

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await ensureAtLeastOneAdminRemains(client, ids);
    await client.query(
      `UPDATE public.subscribers SET rol = 'user' WHERE id = ANY($1::uuid[])`,
      [ids]
    );
    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }

  revalidatePath("/admin/users");
  return { ok: true, message: "Cambiados a user" };
}

/** Acción: eliminar seleccionados */
export async function deleteUsersAction(formData: FormData) {
  const me = await requireAdmin();
  const myId = me.id;

  const ids = parseIds(formData);
  if (!ids.length) return { ok: false, message: "Sin selección" };

  const idsSafe = ids.filter((id) => id !== myId);
  if (!idsSafe.length)
    return { ok: false, message: "No puedes eliminar tu propio usuario" };

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await ensureAtLeastOneAdminRemains(client, idsSafe);
    await client.query(
      `DELETE FROM public.subscribers WHERE id = ANY($1::uuid[])`,
      [idsSafe]
    );
    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }

  revalidatePath("/admin/users");
  return { ok: true, message: "Usuarios eliminados" };
}