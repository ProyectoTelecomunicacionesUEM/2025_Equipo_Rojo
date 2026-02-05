"use client";

import { useState, useEffect } from "react"; // Añadimos useEffect
import Link from "next/link";
import { useRouter } from "next/navigation"; // Añadimos useRouter
import DarkModeToggle from "@/components/DarkModeToggle";
import { signOut, useSession } from "next-auth/react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  // EFECTO DE SEGURIDAD: Si no hay sesión, mandamos al login y 
  // evitamos que puedan volver atrás con el navegador.
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login"); 
    }
  }, [status, router]);

  // Si está cargando o no hay sesión, no mostramos nada para evitar el "flash" de datos
  if (status === "loading" || !session) {
    return <div style={loadingStyle}>Cargando panel...</div>;
  }

  const isAdmin = session?.user?.role === "admin";

  return (
    <div className="admin-container">
      <style>{`
        :root { --sidebar-width: 250px; }
        .admin-container { display: flex; min-height: 100vh; }
        
        .sidebar {
          width: var(--sidebar-width); background: #1a1a1a; color: white;
          padding: 20px; position: fixed; height: 100vh; z-index: 1000;
          transition: transform 0.3s ease;
        }

        .main-wrapper {
          flex: 1; margin-left: var(--sidebar-width);
          display: flex; flex-direction: column; min-width: 0;
        }

        .header-admin {
          height: 70px; background: var(--bg-card);
          border-bottom: 1px solid var(--border-color);
          display: flex; justify-content: flex-end; align-items: center;
          padding: 0 20px; gap: 15px; position: sticky; top: 0; z-index: 100;
        }

        .btn-menu-toggle {
          display: none; background: #2a2a2a; color: white; border: none;
          padding: 8px 12px; border-radius: 6px; cursor: pointer;
        }

        /* ... (resto de tus estilos anteriores) */

        @media (max-width: 768px) {
          .sidebar { 
            /* Ajustamos el ancho para que no sea excesivo en pantallas pequeñas */
            width: 80%; 
            max-width: 300px;
            /* Aplicamos la transformación */
            transform: translateX(${isMobileMenuOpen ? "0" : "-100%"}); 
            /* Añadimos una sombra para que "flote" sobre el contenido */
            box-shadow: ${isMobileMenuOpen ? "5px 0 15px rgba(0,0,0,0.5)" : "none"};
          }
          
          .main-wrapper { 
            margin-left: 0; 
          }

          .btn-menu-toggle { 
            display: block; 
          }

          /* Opcional: Evitar que el contenido se mueva si el menú está abierto */
          .admin-container {
            overflow-x: hidden;
          }
        }
      `}</style>

      {/* BARRA LATERAL */}
      <nav className="sidebar">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontSize: "1.2rem", margin: 0 }}>🚚 Control Frío</h2>
          <button className="btn-menu-toggle" onClick={() => setIsMobileMenuOpen(false)}>✕</button>
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
<Link href={isAdmin ? "/admin" : "/admin/users/dashboard"} style={linkStyle} onClick={() => setIsMobileMenuOpen(false)}>🏠 Inicio (Dashboard)</Link>             
          {isAdmin && (
            <>
              <div style={sectionTitleStyle}>ZONA DE ADMINISTRACIÓN</div>
              <Link href="/admin/users" style={linkStyle} onClick={() => setIsMobileMenuOpen(false)}>👥 Gestionar Usuarios</Link>
              <Link href="/admin/devices" style={linkStyle} onClick={() => setIsMobileMenuOpen(false)}>🔧 Asignar Camiones</Link>
              <Link href="/admin/fleet" style={linkStyle} onClick={() => setIsMobileMenuOpen(false)}>📦 Estado de Flota</Link>

            </>
          )}
        </div>
      </nav>

      <div className="main-wrapper">
        <header className="header-admin">
          <button className="btn-menu-toggle" onClick={() => setIsMobileMenuOpen(true)} style={{marginRight: 'auto'}}>
            ☰ Menú
          </button>

          <DarkModeToggle />
          
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "var(--foreground)", fontSize: "12px", fontWeight: 700 }}>
              {session?.user?.email}
            </div>
            <div style={badgeRol(isAdmin)}>
              {isAdmin ? "Administrador" : "Usuario"}
            </div>
          </div>
          
          <button onClick={() => signOut({ callbackUrl: "/login" })} style={btnLogOut}>
            Cerrar sesión
          </button>
        </header>

        <main style={{ flex: 1, background: "var(--background)", color: "var(--foreground)", padding: "20px" }}>
          {children}
        </main>
      </div>
    </div>
  );
}

// ESTILOS DE APOYO
const linkStyle = { color: "white", textDecoration: "none", padding: "12px", borderRadius: "6px", background: "#2a2a2a", fontSize: "14px", display: "block" };
const sectionTitleStyle = { borderTop: "1px solid #333", marginTop: "10px", paddingTop: "10px", fontSize: "11px", color: "#888", fontWeight: "bold" };
const btnLogOut = { background: "#ff4d4f", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 15px", cursor: "pointer", fontWeight: 700, fontSize: "12px" };
const loadingStyle: React.CSSProperties = { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#1a1a1a", color: "white" };
const badgeRol = (isAdmin: boolean) => ({
  color: isAdmin ? "#0052cc" : "#065f46", 
  fontSize: "10px", 
  fontWeight: 800, 
  textTransform: "uppercase" as const,
  background: isAdmin ? "#e6f0ff" : "#ecfdf5",
  padding: "2px 8px",
  borderRadius: "4px",
  border: isAdmin ? "1px solid #b3d4ff" : "1px solid #a7f3d0",
});