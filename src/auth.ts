// src/types/next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Session que devuelve NextAuth en App Router
   */
  interface Session extends DefaultSession {
    user: {
      id: string;              // obligatorio
      email: string;           // obligatorio
      role: "admin" | "user";  // obligatorio
      name?: string;
    };
  }

  /**
   * Usuario dentro de NextAuth
   */
  interface User {
    id: string;               // obligatorio, igual que Session.user.id
    email: string;
    role: "admin" | "user";
  }
}

declare module "next-auth/jwt" {
  /**
   * JWT que usa NextAuth
   */
  interface JWT {
    id: string;               // obligatorio, igual que User.id
    email: string;
    role: "admin" | "user";
  }
}
