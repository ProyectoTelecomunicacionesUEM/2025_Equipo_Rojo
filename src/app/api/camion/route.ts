import { db, trucks, measurements } from "@/lib/db";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/authOptions";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const emailABuscar = session.user.email;

    // 1. Buscamos el camión asignado al usuario
    const camionEncontrado = await db
      .select()
      .from(trucks)
      .where(eq(trucks.operator_id, emailABuscar)) 
      .limit(1); 
    
    if (!camionEncontrado || camionEncontrado.length === 0) {
        return NextResponse.json({ 
          id: "Sin vehículo", 
          temperature: 0,
          status: "esperando_asignacion" 
        });
    }

    const miCamion = camionEncontrado[0];

    // 2. ¡CLAVE DE COHERENCIA!: Buscamos la última medición real de ese camión
    const ultimaMedicion = await db
      .select()
      .from(measurements)
      .where(eq(measurements.device_id, miCamion.id))
      .orderBy(desc(measurements.created_at))
      .limit(1);

    // 3. Devolvemos el objeto combinado
    return NextResponse.json({
      id: miCamion.id,
      // Si el script aún no ha creado datos para este ID, devolvemos un valor seguro
      temperature: ultimaMedicion.length > 0 ? ultimaMedicion[0].temperature : -5,
      status: ultimaMedicion.length > 0 ? ultimaMedicion[0].status : "en_ruta"
    });

  } catch (error: any) {
    console.error("❌ ERROR CRÍTICO EN API CAMION:", error.message);
    return NextResponse.json(
      { error: "Error de servidor", message: error.message }, 
      { status: 500 }
    );
  }
}