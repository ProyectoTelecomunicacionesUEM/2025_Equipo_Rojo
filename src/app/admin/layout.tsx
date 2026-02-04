"use client"; // <--- Obligatorio para usar hooks y botones interactivos

import Link from "next/link";
import DarkModeToggle from "@/components/DarkModeToggle";
import { signOut, useSession } from "next-auth/react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* BARRA LATERAL (Menú) */}
      <nav style={{ width: "250px", background: "#1a1a1a", color: "white", padding: "20px", position: "fixed", height: "100vh" }}>
        <h2 style={{ fontSize: "1.2rem", marginBottom: "30px" }}>🚚 Control Frío</h2>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <Link href="/admin" style={linkStyle}>🏠 Inicio (Dashboard)</Link>
          <Link href="/admin/users" style={linkStyle}>👥 Gestionar Usuarios</Link>
          <Link href="/admin/devices" style={linkStyle}>📦 Estado de Flota</Link>
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <div style={{ flex: 1, marginLeft: "250px", display: "flex", flexDirection: "column" }}>
        
        {/* BARRA SUPERIOR (Donde vive el modo oscuro) */}
        <header style={{
          height: "60px",
          background: "var(--bg-card)",
          borderBottom: "1px solid var(--border-color)",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          padding: "0 20px",
          gap: "15px",
          position: "sticky",
          top: 0,
          zIndex: 100
        }}>
          <DarkModeToggle /> {/* <--- ¡Aquí está tu botón! */}
          
          {session?.user?.email && (
            <span style={{ color: "var(--foreground)", fontSize: "14px", fontWeight: 600 }}>
              {session.user.email}
            </span>
          )}
          
          <button 
            onClick={() => signOut({ callbackUrl: "/login" })}
            style={btnLogOut}
          >
            Salir
          </button>
        </header>

        {/* Las páginas se cargan aquí */}
        <main style={{ flex: 1, background: "var(--background)", color: "var(--foreground)" }}>
          {children}
        </main>
      </div>
    </div>
  );
}

const linkStyle = { color: "white", textDecoration: "none", padding: "10px", borderRadius: "5px", background: "#333" };
const btnLogOut = { background: "#ff4d4f", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 16px", cursor: "pointer", fontWeight: 700, fontSize: "14px" };