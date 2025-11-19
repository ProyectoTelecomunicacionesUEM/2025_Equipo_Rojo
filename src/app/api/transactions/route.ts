import { auth } from "@/auth";
import { pool } from "@/lib/db";
import { NextRequest } from "next/server";

async function getUserId(email: string) {
  const { rows } = await pool.query("SELECT id FROM users WHERE email=$1 LIMIT 1", [email]);
  return rows[0]?.id as string | undefined;
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userId = await getUserId(session.user.email);
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { rows } = await pool.query(
    "SELECT id, amount, currency, occurred_at, note FROM transactions WHERE user_id=$1 ORDER BY occurred_at DESC LIMIT 50",
    [userId]
  );

  return new Response(JSON.stringify({ transactions: rows }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userId = await getUserId(session.user.email);
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const { amount, currency = "EUR", note = null } = body || {};

  if (!amount) {
    return new Response("amount requerido", { status: 400 });
  }

  await pool.query(
    "INSERT INTO transactions (user_id, amount, currency, note) VALUES ($1,$2,$3,$4)",
    [userId, amount, currency, note]
  );

  return new Response(JSON.stringify({ ok: true }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
