
import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  try {
    const { rows } = await pool.query("SELECT now() as now, current_database() as db");
    return NextResponse.json({ ok: true, db: rows[0].db, time: rows[0].now });
  } catch (err: any) {
    console.error("DB health error:", err);
    return NextResponse.json({ ok: false, error: err?.message ?? "Unknown error" }, { status: 500 });
  }
}
