"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { loginAction } from "./actions";
import styles from "./styles.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  // Inputs controlados
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <main className={styles.wrapper}>
      {/* HEADER */}
      <header className={styles.topbar}>
        <div className={styles.topbarInner}>
          <Link
            href="/"
            className={styles.brand}
            title="Ir a la página principal"
          >
            {process.env.NEXT_PUBLIC_APP_NAME ?? "FrostTrack"}
          </Link>

          <nav className={styles.topbarNav}>
            <button
              type="button"
              onClick={() => router.replace("/register")}
              className={styles.loginLink}
              title="Crear una cuenta nueva"
            >
              Regístrate
            </button>
          </nav>
        </div>
      </header>

      {/* CONTENIDO SPLIT */}
      <section className={styles.page}>
        <div className={styles.split}>
          {/* COLUMNA IZQUIERDA */}
          <div className={styles.left}>
            <Image
              src="/images/camionIcono.png"
              alt="Inicio de sesión"
              title="Imagen ilustrativa del inicio de sesión"
              width={600}
              height={400}
              className={styles.heroImage}
              priority
            />
          </div>

          {/* COLUMNA DERECHA */}
          <div className={styles.right}>
            <section className={styles.card} aria-labelledby="login-title">
              <h2
                id="login-title"
                className={styles.title}
                title="Formulario de inicio de sesión"
              >
                Iniciar sesión
              </h2>

              <form
                className={styles.form}
                action={(formData) => {
                  setMessage(null);

                  startTransition(async () => {
                    const res = await loginAction(formData);

                    if (!res.ok) {
                      setMessage(
                        res.message ?? "Correo o contraseña incorrectos."
                      );
                      return;
                    }

                    setMessage(res.message ?? "Inicio de sesión correcto.");
                    setEmail("");
                    setPassword("");
                    router.replace("/dashboard");
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
                    placeholder="tucorreo@empresa.com"
                    className={styles.input}
                    autoComplete="username"
                    required
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
                    <Link
                      href="/recuperar"
                      className={styles.link}
                      title="Recuperar contraseña"
                    >
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>

                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className={styles.input}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className={styles.button}
                  disabled={pending}
                >
                  {pending ? "Accediendo..." : "Iniciar sesión"}
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
          </div>
        </div>
      </section>
    </main>
  );
}
