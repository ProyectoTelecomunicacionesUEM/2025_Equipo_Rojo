import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { device_id, temperature, humidity, status } = body;

    // Guardar en Neon usando .query (RF-11)
    await db.query(
      "INSERT INTO measurements (device_id, temperature, humidity, status) VALUES ($1, $2, $3, $4)",
      [device_id, temperature, humidity, status]
    );

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}