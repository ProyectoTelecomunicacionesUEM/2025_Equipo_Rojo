// src/types/next-auth.d.ts

import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;              // obligatorio
      email: string;           // obligatorio
      role: "admin" | "user";  // obligatorio
    };
  }

  interface User {
    id: string;
    email: string;
    role: "admin" | "user";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    role: "admin" | "user";
  }
}
