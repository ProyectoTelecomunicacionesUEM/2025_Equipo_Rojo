import Credentials from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import { pool } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email.trim().toLowerCase();

        // ✅ Usa <...> (no &lt; &gt;) y tipos defensivos
        const { rows } = await pool.query<{
          id: string;
          email: string;
          name: string | null;
          password: string;
          rol: "admin" | "user" | null;
          activo: boolean;
        }>(
          `
          SELECT id, email, name, password, rol, activo
          FROM subscribers
          WHERE lower(email) = lower($1)
          LIMIT 1
        `,
          [email]
        );

        if (rows.length === 0) return null;

        const user = rows[0];
        if (!user.activo) return null;

        // ✅ valida password
        const ok = await bcrypt.compare(credentials.password, user.password || "");
        if (!ok) return null;

        // ✅ valida rol existente
        if (user.rol !== "admin" && user.rol !== "user") return null;

        // ✅ devuelve el rol REAL (sin hardcodes)
        return {
          id: user.id,
          email: user.email,
          name: user.name ?? "",
          role: user.rol, // 'admin' | 'user'
        };
      },
    }),
  ],

  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.email = user.email as string;
        // ✅ sin defaults peligrosos
        token.role = (user as any).role as "admin" | "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.role = token.role as "admin" | "user";
      }
      return session;
    },
  },
};