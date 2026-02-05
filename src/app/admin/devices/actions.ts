"use server";

import { db, trucks } from "@/lib/db";
import { eq, and, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function asignarCamionAction(formData: FormData) {
  const truckId = formData.get("truckId") as string;
  const email = formData.get("email") as string;

  if (!truckId) return;

  // 1. Si vamos a asignar a alguien (email no es vacío)
  if (email && email !== "") {
    // BUSCAMOS si este correo ya tiene OTRO camión asignado
    // (Buscamos donde operator_id sea el email pero el ID del camión sea DISTINTO al actual)
    await db
      .update(trucks)
      .set({ operator_id: null })
      .where(eq(trucks.operator_id, email));
  }

  // 2. Ahora asignamos el camión actual al conductor
  const emailParaGuardar = email === "" ? null : email;
  
  await db
    .update(trucks)
    .set({ operator_id: emailParaGuardar })
    .where(eq(trucks.id, truckId));

  revalidatePath("/admin/devices");
  revalidatePath("/admin/fleet");
}