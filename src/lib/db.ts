import { Pool } from "pg";
import { pgTable, text, timestamp, doublePrecision, serial } from "drizzle-orm/pg-core"; // <--- Añade serial y doublePrecision
import { drizzle } from "drizzle-orm/node-postgres";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

export const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

export const db = drizzle(pool);

// --- TABLA DE CAMIONES ---
// Busca donde definiste la tabla trucks y asegúrate de que tenga esto:
export const trucks = pgTable('trucks', {
  id: text('id').primaryKey(),
  operator_id: text('operator_id'),
  temperature: doublePrecision('temperature').default(-18.0), // AÑADE ESTA LÍNEA
  createdAt: timestamp('created_at').defaultNow(),
});

// --- AÑADE ESTO (LA TABLA QUE FALTA) ---
export const measurements = pgTable("measurements", {
  id: serial("id").primaryKey(),            // ID autoincremental
  device_id: text("device_id"),             // Nombre del camión
  temperature: doublePrecision("temperature"), // Temperatura con decimales
  status: text("status"),                   // OK, ALERTA, etc.
  created_at: timestamp("created_at").defaultNow(),
});

// --- TABLA DE SUSCRIPTORES (Tus usuarios reales) ---
export const subscribers = pgTable('subscribers', {
  id: text('id').primaryKey(), // Veo en tu foto que es un UUID (text)
  name: text('name'),
  email: text('email').notNull().unique(),
  rol: text('rol'), // Ojo: en tu Neon se llama 'rol', no 'role'
  activo: text('activo'), // Por si lo necesitas luego
  created_at: timestamp('created_at').defaultNow(),
  password: text('password'),
});

