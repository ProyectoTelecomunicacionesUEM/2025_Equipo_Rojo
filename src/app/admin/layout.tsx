"use client";

import { useState } from "react";
import Link from "next/link";
import DarkModeToggle from "@/components/DarkModeToggle";
import { signOut, useSession } from "next-auth/react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (status === "loading") {
    return <div style={loadingStyle}>Cargando panel...</div>;
  }

  const userRole = session?.user?.role;
  const isAdmin = userRole === "admin";

  return (
    <div className="admin-container">
      <style>{`
        :root {
          --sidebar-width: 250px;
        }

        .admin-container {
          display: flex;
          min-h-screen;
        }

        /* BARRA LATERAL RESPONSIVA */
        .sidebar {
          width: var(--sidebar-width);
          background: #1a1a1a;
          color: white;
          padding: 20px;
          position: fixed;
          height: 100vh;
          z-index: 1000;
          transition: transform 0.3s ease;
        }

        /* CONTENIDO PRINCIPAL RESPONSIVO */
        .main-wrapper {
          flex: 1;
          margin-left: var(--sidebar-width);
          display: flex;
          flex-direction: column;
          min-width: 0; /* Evita desbordamiento de hijos */
        }

        .header-admin {
          height: 70px;
          background: var(--bg-card);
          border-bottom: 1px solid var(--border-color);
          display: flex;
          justify-content: flex-end;
          align-items: center;
          padding: 0 20px;
          gap: 15px;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .btn-menu-toggle {
          display: none;
          background: #2a2a2a;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          margin-right: auto;
        }

        /* MEDIA QUERIES PARA MÓVIL */
        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(${isMobileMenuOpen ? "0" : "-100%"});
          }
          .main-wrapper {
            margin-left: 0;
          }
          .btn-menu-toggle {
            display: block;
          }
        }
      `}</style>

      {/* BARRA LATERAL */}
      <nav className="sidebar">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontSize: "1.2rem", margin: 0 }}>🚚 Control Frío</h2>
          <button className="btn-menu-toggle" onClick={() => setIsMobileMenuOpen(false)} style={{ margin: 0 }}>✕</button>
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Link href="/admin" style={linkStyle} onClick={() => setIsMobileMenuOpen(false)}>🏠 Inicio (Dashboard)</Link>
          
          {isAdmin ? (
            <>
              <div style={sectionTitleStyle}>ZONA DE ADMINISTRACIÓN</div>
              <Link href="/admin/users" style={linkStyle} onClick={() => setIsMobileMenuOpen(false)}>👥 Gestionar Usuarios</Link>
              <Link href="/admin/devices" style={linkStyle} onClick={() => setIsMobileMenuOpen(false)}>📦 Estado de Flota</Link>
            </>
          ) : (
            <div style={{ borderTop: "1px solid #333", marginTop: "10px", paddingTop: "10px", fontSize: "11px", color: "#52c41a" }}>
              VISTA DE USUARIO ACTIVA
            </div>
          )}
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <div className="main-wrapper">
        <header className="header-admin">
          {/* Botón Hamburguesa */}
          <button className="btn-menu-toggle" onClick={() => setIsMobileMenuOpen(true)}>
            ☰ Menú
          </button>

          <DarkModeToggle />
          
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", overflow: "hidden" }}>
            <span style={{ color: "var(--foreground)", fontSize: "12px", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "150px" }}>
              {session?.user?.email}
            </span>
            <span style={{ 
              color: isAdmin ? "#0052cc" : "#065f46", 
              fontSize: "10px", 
              fontWeight: 800, 
              textTransform: "uppercase",
              background: isAdmin ? "#e6f0ff" : "#ecfdf5",
              padding: "2px 8px",
              borderRadius: "4px",
              marginTop: "2px",
              border: isAdmin ? "1px solid #b3d4ff" : "1px solid #a7f3d0",
            }}>
              {isAdmin ? "Administrador" : "Usuario"}
            </span>
          </div>
          
          <button onClick={() => signOut({ callbackUrl: "/login" })} style={btnLogOut}>
            Cerrar sesión
          </button>
        </header>

        <main style={{ flex: 1, background: "var(--background)", color: "var(--foreground)", padding: "20px" }}>
          {children}
        </main>

        {/* FOOTER INTEGRADO */}
        <footer style={footerStyle}>
           <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', alignItems: 'center' }}>
             <span>soporte@frosttrack.com</span>
             <span>|</span>
             <span>612345678</span>
             <div style={{ fontSize: '12px', opacity: 0.8, width: '100%', textAlign: 'center', marginTop: '10px' }}>
               © 2026 FrostTrack. Todos los derechos reservados.
             </div>
           </div>
        </footer>
      </div>
    </div>
  );
}

// ESTILOS DE APOYO
const linkStyle = { color: "white", textDecoration: "none", padding: "12px", borderRadius: "6px", background: "#2a2a2a", fontSize: "14px", display: "block" };
const sectionTitleStyle = { borderTop: "1px solid #333", marginTop: "10px", paddingTop: "10px", fontSize: "11px", color: "#888", fontWeight: "bold" };
const btnLogOut = { background: "#ff4d4f", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 15px", cursor: "pointer", fontWeight: 700, fontSize: "12px" };
const loadingStyle: React.CSSProperties = { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#1a1a1a", color: "white" };
const footerStyle: React.CSSProperties = { background: "#2563eb", color: "white", padding: "20px", textAlign: "center" };