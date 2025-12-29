
import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

// Tipamos el shape de la fila que devuelve la query
type HealthRow = {
  now: string; // Postgres devuelve timestamp como string por defecto en 'pg'
  db: string;
};

export async function GET() {
  try {
    const { rows } = await pool.query<HealthRow>(
      "SELECT now() as now, current_database() as db"
    );

    const first = rows[0];
    return NextResponse.json({ ok: true, db: first?.db, time: first?.now });
  } catch (err: unknown) {
    // Refinamos el error de forma segura sin 'any'
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("DB health error:", err);
    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}
