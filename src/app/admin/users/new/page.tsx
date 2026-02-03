"use client";

import { useState } from "react";
import { createUserAction } from "../actions"; 

export default function NewUserPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    
    try {
      const res = await createUserAction(formData);
      if (res.ok) {
        window.location.href = "/admin/users"; 
      } else {
        setError(res.message || "Error al crear usuario");
        setLoading(false);
      }
    } catch (err) {
      setError("Ocurrió un error inesperado");
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)", padding: "40px 20px" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        
        {/* BOTÓN VOLVER ATRÁS - FORZADO */}
<div style={{ marginBottom: "20px" }}>
  <a 
    href="/admin/users" 
    style={{ 
      display: "inline-flex", 
      alignItems: "center",
      gap: "8px",
      color: "var(--text-muted)", 
      textDecoration: "none", 
      fontSize: "16px",
      fontWeight: 600,
      cursor: "pointer",
      padding: "10px 0", // Área de clic más alta
      position: "relative",
      zIndex: 999 // Nos aseguramos de que esté por encima de todo
    }}
  >
    <span style={{ fontSize: "20px" }}>←</span> Volver a la lista
  </a>
</div>

        <div style={{ background: "var(--bg-card)", padding: "40px", borderRadius: "20px", border: "1px solid var(--border-color)", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
          <h1 style={{ color: "var(--foreground)", marginBottom: "30px", fontSize: "28px" }}>Dar de alta nuevo usuario</h1>
          
          {error && (
            <div style={{ background: "#ff4d4f22", color: "#ff4d4f", padding: "15px", borderRadius: "10px", marginBottom: "20px", fontWeight: 600, border: "1px solid #ff4d4f" }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            
            <div>
              <label style={labelStyle}>Nombre Completo</label>
              <input name="name" type="text" required placeholder="Ej. Juan Pérez" style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Correo Electrónico</label>
              <input name="email" type="email" required placeholder="correo@ejemplo.com" style={inputStyle} />
            </div>

            <div style={{ position: "relative" }}>
              <label style={labelStyle}>Contraseña Inicial</label>
              <div style={{ position: "relative" }}>
                <input 
                  name="password" 
                  type={showPassword ? "text" : "password"} 
                  required 
                  style={{ ...inputStyle, paddingRight: "50px" }} 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={eyeButtonStyle}
                >
                  {showPassword ? "👁️‍🗨️" : "👁️"} 
                </button>
              </div>
            </div>

            <div>
              <label style={labelStyle}>Rol del Usuario</label>
              <select name="rol" style={inputStyle}>
                <option value="user">Usuario (User)</option>
                <option value="admin">Administrador (Admin)</option>
              </select>
            </div>

            <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
              <button 
                type="submit" 
                disabled={loading} 
                style={{ ...btnSave, opacity: loading ? 0.7 : 1 }}
              >
                {loading ? "Guardando..." : "Crear Usuario"}
              </button>
              
              <a 
                href="/admin/users" 
                style={{ 
                  ...btnCancel, 
                  textDecoration: "none", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  textAlign: "center"
                }}
              >
                Cancelar
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = { display: "block", marginBottom: "8px", fontWeight: 600, color: "var(--foreground)", fontSize: "16px" };
const inputStyle: React.CSSProperties = { width: "100%", height: "50px", padding: "0 15px", borderRadius: "10px", border: "1px solid var(--border-color)", background: "var(--background)", color: "var(--foreground)", fontSize: "16px", boxSizing: "border-box" };
const btnSave: React.CSSProperties = { flex: 2, height: "55px", background: "#0b5fff", color: "#fff", border: "none", borderRadius: "12px", fontSize: "18px", fontWeight: 700, cursor: "pointer" };
const btnCancel: React.CSSProperties = { flex: 1, height: "55px", background: "transparent", color: "var(--foreground)", border: "2px solid var(--border-color)", borderRadius: "12px", fontSize: "16px", fontWeight: 600, cursor: "pointer" };
const eyeButtonStyle: React.CSSProperties = { position: "absolute", right: "15px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "20px", zIndex: 10 };