"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { loginAction } from "./actions";
import styles from "./styles.module.css";

type Role = "user" | "admin";

export default function LoginPage() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("user");

  return (
    <main className={styles.wrapper}>
      {/* HEADER */}
      <header className={styles.topbar}>
        <div className={styles.topbarInner}>
          <Link
            href="/"
            className={styles.topbarBrand}
            title="Ir a la página principal"
          >
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
              alt="Inicio de sesión"
              width={600}
              height={400}
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

              <form
                className={styles.form}
                action={(formData) => {
                  setMessage(null);
                  formData.set("role", role);

                  startTransition(async () => {
                    const res = await loginAction(formData);

                    if (!res?.ok) {
                      setMessage(
                        res?.message ?? "Correo o contraseña incorrectos"
                      );
                      return;
                    }

                    setEmail("");
                    setPassword("");

                    router.replace(res?.redirectTo ?? "/dashboard");
                  });
                }}
                noValidate
                aria-describedby="form-desc"
              >
                <div id="form-desc" className={styles.srOnly}>
                  Formulario de inicio de sesión con correo y contraseña
                </div>

                {/* EMAIL */}
                <div className={styles.field}>
                  <label htmlFor="email" className={styles.label}>
                    Correo electrónico
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className={styles.input}
                    required
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* PASSWORD */}
                <div className={styles.field}>
                  <div className={styles.labelRow}>
                    <label htmlFor="password" className={styles.label}>
                      Contraseña
                    </label>
                  </div>

                  <input
                    id="password"
                    name="password"
                    type="password"
                    className={styles.input}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <input type="hidden" name="role" value={role} />

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
