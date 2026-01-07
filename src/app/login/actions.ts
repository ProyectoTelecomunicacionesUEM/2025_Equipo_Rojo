"use server";

import { pool } from "../../lib/db";
import bcrypt from "bcryptjs";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { ok: false, message: "Email y contraseña son obligatorios." };
  }

  try {
    const { rows } = await pool.query<{
      id: number;
      password: string;
      name: string;
    }>(
      "SELECT id, password, name FROM subscribers WHERE email = $1",
      [email]
    );

    if (rows.length === 0) {
      return { ok: false, message: "Usuario no encontrado." };
    }

    const user = rows[0];

    // comparar hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { ok: false, message: "Contraseña incorrecta." };
    }

    return {
      ok: true,
      message: `Bienvenido ${user.name}`,
      user: { id: user.id, name: user.name, email },
    };
  } catch (err) {
    console.error("Error en login:", err);
    return { ok: false, message: "Error al iniciar sesión." };
  }
}
