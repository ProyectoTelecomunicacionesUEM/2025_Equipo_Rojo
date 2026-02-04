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
    <div className="new-user-container">
      <style>{`
        .new-user-container {
          min-height: 100vh;
          background: var(--background);
          padding: 20px; /* Reducido para móvil */
        }
        
        .form-card {
          background: var(--bg-card);
          padding: 40px;
          border-radius: 20px;
          border: 1px solid var(--border-color);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          width: 100%;
          box-sizing: border-box;
        }

        .button-group {
          margin-top: 20px;
          display: flex;
          gap: 10px;
        }

        /* AJUSTES PARA MÓVIL */
        @media (max-width: 600px) {
          .new-user-container {
            padding: 10px;
          }
          .form-card {
            padding: 20px; /* Menos espacio interno en móvil */
          }
          .button-group {
            flex-direction: column; /* Botones uno arriba del otro */
          }
          h1 {
            font-size: 22px !important;
          }
        }
      `}</style>

      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        
        {/* BOTÓN VOLVER ATRÁS */}
        <div style={{ marginBottom: "15px" }}>
          <a 
            href="/admin/users" 
            style={{ 
              display: "inline-flex", 
              alignItems: "center",
              gap: "8px",
              color: "var(--text-muted)", 
              textDecoration: "none", 
              fontSize: "14px",
              fontWeight: 600,
              padding: "10px 0"
            }}
          >
            <span style={{ fontSize: "18px" }}>←</span> Volver a la lista
          </a>
        </div>

        <div className="form-card">
          <h1 style={{ color: "var(--foreground)", marginBottom: "25px", fontSize: "28px", fontWeight: "bold" }}>
            Dar de alta nuevo usuario
          </h1>
          
          {error && (
            <div style={{ background: "#ff4d4f22", color: "#ff4d4f", padding: "15px", borderRadius: "10px", marginBottom: "20px", fontWeight: 600, border: "1px solid #ff4d4f", fontSize: "14px" }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            
            <div>
              <label style={labelStyle}>Nombre Completo</label>
              <input name="name" type="text" required placeholder="Ej. Juan Pérez" style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Correo Electrónico</label>
              <input name="email" type="email" required placeholder="correo@ejemplo.com" style={inputStyle} />
            </div>

            <div>
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
              <select name="rol" style={{...inputStyle, appearance: "none"}}>
                <option value="user">Usuario (User)</option>
                <option value="admin">Administrador (Admin)</option>
              </select>
            </div>

            <div className="button-group">
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
                  justifyContent: "center"
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

const labelStyle: React.CSSProperties = { display: "block", marginBottom: "6px", fontWeight: 600, color: "var(--foreground)", fontSize: "14px" };
const inputStyle: React.CSSProperties = { width: "100%", height: "48px", padding: "0 15px", borderRadius: "10px", border: "1px solid var(--border-color)", background: "var(--background)", color: "var(--foreground)", fontSize: "16px", boxSizing: "border-box" };
const btnSave: React.CSSProperties = { flex: 2, minHeight: "50px", background: "#0b5fff", color: "#fff", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: 700, cursor: "pointer" };
const btnCancel: React.CSSProperties = { flex: 1, minHeight: "50px", background: "transparent", color: "var(--foreground)", border: "1px solid var(--border-color)", borderRadius: "12px", fontSize: "15px", fontWeight: 600, cursor: "pointer" };
const eyeButtonStyle: React.CSSProperties = { position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "18px", zIndex: 10 };