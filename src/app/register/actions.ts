
"use server";

import { pool } from "../../lib/db";
import { registerSchema } from "../../lib/schemas";

export async function registerAction(formData: FormData) {
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      message: "Datos no válidos.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { name, email } = parsed.data;

  try {
    // comprobar duplicado
    const { rows } = await pool.query<{ count: string }>(
      "SELECT COUNT(*)::text AS count FROM subscribers WHERE email = $1",
      [email]
    );
    const count = Number(rows[0]?.count ?? 0);
    if (count > 0) {
      return { ok: false, message: "Este email ya está registrado." };
    }

    // insertar
    await pool.query(
      "INSERT INTO subscribers (name, email) VALUES ($1, $2)",
      [name, email]
    );

    return { ok: true, message: "Registro completado." };
  } catch (err) {
    console.error("Error al registrar:", err);
    return {
      ok: false,
      message: "Ha ocurrido un error. Inténtalo de nuevo más tarde.",
    };
  }
}
