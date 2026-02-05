import { db, measurements } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { device_id, temperature, status, humidity } = body;

    // Insertamos solo lo que Drizzle reconoce al 100%
    // Si 'humidity' te sigue dando error de subrayado rojo, bórralo de aquí
    await db.insert(measurements).values({
      device_id: device_id,
      temperature: temperature,
      status: status || "en_ruta",
      // humidity: humidity // Descomenta esto solo si lo añades al schema.ts
    });

    console.log(`✅ [Neon] Registro guardado para ${device_id}`);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("🚨 Error al insertar en Neon:", e.message);
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}