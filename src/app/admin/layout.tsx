"use client";

import Link from "next/link";
import DarkModeToggle from "@/components/DarkModeToggle";
import { signOut, useSession } from "next-auth/react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // 1. Obtenemos el estado de la sesión
  const { data: session, status } = useSession();

  // 🔍 LOG DE DIAGNÓSTICO: Esto te dirá la verdad en la consola (F12)
  console.log("DEBUG SESIÓN:", session);

  // 2. Mientras se comprueba quién eres, no mostramos nada para evitar errores visuales
  if (status === "loading") {
    return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#1a1a1a", color: "white" }}>Cargando panel...</div>;
  }

  // 3. Verificamos el rol que viene de tu base de datos (Neon)
  const userRole = session?.user?.role;
  const isAdmin = userRole === "admin";

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* BARRA LATERAL */}
      <nav style={{ width: "250px", background: "#1a1a1a", color: "white", padding: "20px", position: "fixed", height: "100vh", zIndex: 1000 }}>
        <h2 style={{ fontSize: "1.2rem", marginBottom: "30px" }}>🚚 Control Frío</h2>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {/* Opción universal: Todos la ven */}
          <Link href="/admin" style={linkStyle}>🏠 Inicio (Dashboard)</Link>
          
          {/* BLOQUE RESTRINGIDO: Solo si el rol es exactamente 'admin' */}
          {isAdmin ? (
            <>
              <div style={{ borderTop: "1px solid #333", marginTop: "10px", paddingTop: "10px", fontSize: "11px", color: "#888", fontWeight: "bold" }}>
                ZONA DE ADMINISTRACIÓN
              </div>
              <Link href="/admin/users" style={linkStyle}>👥 Gestionar Usuarios</Link>
              <Link href="/admin/devices" style={linkStyle}>📦 Estado de Flota</Link>
            </>
          ) : (
            /* Mensaje para el usuario estándar */
            <div style={{ borderTop: "1px solid #333", marginTop: "10px", paddingTop: "10px", fontSize: "11px", color: "#52c41a" }}>
              VISTA DE USUARIO ACTIVA
            </div>
          )}
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <div style={{ flex: 1, marginLeft: "250px", display: "flex", flexDirection: "column" }}>
        <header style={headerStyle}>
          <DarkModeToggle />
          
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <span style={{ color: "var(--foreground)", fontSize: "13px", fontWeight: 700 }}>
              {session?.user?.email}
            </span>
            {/* Indicador de Rol dinámico */}
            <span style={{ 
              color: isAdmin ? "#fadb14" : "#52c41a", 
              fontSize: "11px", 
              fontWeight: 800, 
              textTransform: "uppercase",
              background: isAdmin ? "rgba(250, 220, 20, 0.1)" : "rgba(82, 196, 26, 0.1)",
              padding: "2px 8px",
              borderRadius: "4px",
              marginTop: "4px"
            }}>
              {isAdmin ? "Administrador" : "Usuario Estándar"}
            </span>
          </div>
          
          <button onClick={() => signOut({ callbackUrl: "/login" })} style={btnLogOut}>
            Cerrar sesión
          </button>
        </header>

        <main style={{ flex: 1, background: "var(--background)", color: "var(--foreground)", padding: "30px" }}>
          {children}
        </main>
      </div>
    </div>
  );
}

const linkStyle = { color: "white", textDecoration: "none", padding: "12px", borderRadius: "6px", background: "#2a2a2a", fontSize: "14px", transition: "background 0.2s" };
const headerStyle: React.CSSProperties = { height: "70px", background: "var(--bg-card)", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "flex-end", alignItems: "center", padding: "0 30px", gap: "20px", position: "sticky", top: 0, zIndex: 100 };
const btnLogOut = { background: "#ff4d4f", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 20px", cursor: "pointer", fontWeight: 700, fontSize: "14px" };