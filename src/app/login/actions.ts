
"use server";

import { pool } from "../../lib/db";
import bcrypt from "bcryptjs";

type Role = "user" | "admin";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { ok: false, message: "Email y contraseña son obligatorios." };
  }

  try {
    const { rows } = await pool.query<{
      id: string;           // UUID
      password: string;     // hash
      name: string;
      rol: Role;            // ENUM ('admin' | 'user')
      activo: boolean;
    }>(
      `
      SELECT id, password, name, rol, activo
      FROM subscribers
      WHERE lower(email) = $1
      `,
      [email]
    );

    if (rows.length === 0) {
      return { ok: false, message: "Usuario no encontrado." };
    }

    const user = rows[0];

    // usuario desactivado
    if (!user.activo) {
      return { ok: false, message: "La cuenta está desactivada." };
    }

    // comparar hash
    const isMatch = await bcrypt.compare(password, user.password || "");
    if (!isMatch) {
      // (Opcional) contabiliza intentos fallidos
      // await pool.query(`UPDATE subscribers SET failed_attempts = failed_attempts + 1 WHERE id = $1`, [user.id]);
      return { ok: false, message: "Contraseña incorrecta." };
    }

    const effectiveRole: Role = user.rol === "admin" ? "admin" : "user";

    // (Opcional) reset de intentos y last_login
    // await pool.query(`UPDATE subscribers SET failed_attempts = 0, last_login = now() WHERE id = $1`, [user.id]);

    const redirectTo = effectiveRole === "admin" ? "/admin" : "/dashboard";

    return {
      ok: true,
      message: `Bienvenido ${user.name}`,
      user: { id: user.id, name: user.name, email, role: effectiveRole },
      redirectTo,
    };
  } catch (err) {
    console.error("Error en login:", err);
    return { ok: false, message: "Error al iniciar sesión." };
  }
}
