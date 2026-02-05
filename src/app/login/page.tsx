"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import styles from "./styles.module.css";

type Role = "user" | "admin";

export default function LoginPage() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("user");
  
  // NUEVO ESTADO PARA EL OJITO
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className={styles.wrapper}>
      {/* HEADER */}
      <header className={styles.topbar}>
        <div className={styles.topbarInner}>
          <Link href="/" className={styles.topbarBrand}>
            FrostTrack
          </Link>

          <nav className={styles.topbarNav}>
            <button
              type="button"
              onClick={() => router.replace("/register")}
              className={styles.loginLink}
            >
              Regístrate
            </button>
          </nav>
        </div>
      </header>

      {/* CONTENIDO */}
      <section className={styles.page}>
        <div className={styles.split}>
          {/* COLUMNA IZQUIERDA */}
          <div className={styles.left}>
            <Image
              src="/images/camion.png"
              alt="Camión"
              width={2500}
              height={2500}
              priority
            />
          </div>

          {/* COLUMNA DERECHA */}
          <section className={styles.right}>
            <section className={styles.card} aria-labelledby="login-title">
              <h2 id="login-title" className={styles.title}>
                Iniciar sesión
              </h2>

              {/* Selector de rol */}
              <div className={styles.roleRow}>
                <button
                  type="button"
                  onClick={() => setRole("user")}
                  className={`${styles.roleBtn} ${
                    role === "user" ? styles.roleBtnActive : ""
                  }`}
                  aria-pressed={role === "user"}
                >
                  Usuario
                </button>

                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`${styles.roleBtn} ${
                    role === "admin" ? styles.roleBtnActive : ""
                  }`}
                  aria-pressed={role === "admin"}
                >
                  Administrador
                </button>
              </div>

              {/* FORMULARIO */}
              <form
                className={styles.form}
                onSubmit={(e) => {
                  e.preventDefault();
                  setMessage(null);

                  startTransition(async () => {
                    const res = await signIn("credentials", {
                      email,
                      password,
                      redirect: false,
                    });

                    if (res?.ok) {
                      if (role === "admin") {
                        router.replace("/admin");
                      } else {
                        router.replace("/admin/users/dashboard");
                      }
                    } else {
                      setMessage("Credenciales incorrectas");
                    }
                  });
                }}
                noValidate
              >
                {/* EMAIL */}
                <div className={styles.field}>
                  <label htmlFor="email" className={styles.label}>
                    Correo electrónico
                  </label>
                  <input
                    id="email"
                    type="email"
                    className={styles.input}
                    required
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* PASSWORD CON OJITO */}
                <div className={styles.field}>
                  <label htmlFor="password" className={styles.label}>
                    Contraseña
                  </label>
                  <div className={styles.passwordWrapper}>
                    <input
                      id="password"
                      // Cambia dinámicamente entre password y text
                      type={showPassword ? "text" : "password"}
                      className={styles.input}
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className={styles.eyeButton}
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1} // Para que no moleste al usar el Tabulador
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className={styles.button}
                  disabled={pending}
                >
                  {pending
                    ? "Accediendo..."
                    : `Entrar como ${
                        role === "admin" ? "Administrador" : "Usuario"
                      }`}
                </button>
              </form>

              {message && (
                <div className={styles.success} aria-live="polite">
                  {message}
                </div>
              )}

              <div className={styles.divider} />

              <p className={styles.footer}>
                ¿No tienes cuenta?{" "}
                <button
                  type="button"
                  onClick={() => router.replace("/register")}
                  className={styles.link}
                >
                  Regístrate
                </button>
              </p>
            </section>
          </section>
        </div>
      </section>
    </main>
  );
}