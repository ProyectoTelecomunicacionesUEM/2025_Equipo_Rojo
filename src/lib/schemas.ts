import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(80, "Demasiado largo"),
  email: z.string().email("Email no válido").max(120, "Demasiado largo"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
