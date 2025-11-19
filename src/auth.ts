import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "@node-rs/bcrypt";
import { pool } from "@/lib/db";

const handler = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials) return null;

        const { email, password } = credentials;
        if (typeof email !== "string" || typeof password !== "string") return null;

        const { rows } = await pool.query(
          "SELECT id, email, password_hash, name FROM users WHERE email=$1 LIMIT 1",
          [email]
        );
        const user = rows[0];
        if (!user) return null;
        const ok = await compare(password, user.password_hash);
        if (!ok) return null;
        return { id: user.id, email: user.email, name: user.name ?? null };
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
});

export const { handlers, auth } = handler;
export const { GET, POST } = handlers;
