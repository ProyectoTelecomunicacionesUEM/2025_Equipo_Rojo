"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { registerAction } from "./actions";
import styles from "./styles.module.css";

export default function RegisterPage() {
  const router = useRouter();

  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  // Inputs controlados
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // 👈 NUEVO

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
            {process.env.NEXT_PUBLIC_APP_NAME ?? "FrostTrack"}
          </Link>

          <nav className={styles.topbarNav}>
            <button
              type="button"
              onClick={() => router.replace("/login")}
              className={styles.loginLink}
            >
              Iniciar sesión
            </button>
          </nav>
        </div>
      </header>

      {/* CONTENIDO */}
      <section className={styles.page}>
        <div className={styles.split}>
          {/* IZQUIERDA */}
          <div className={styles.left}>
            <Image
              src="/images/tabletTransparente.png"
              alt="Registro de usuario"
              width={600}
              height={400}
              className={styles.heroImage}
              priority
            />
          </div>

          {/* DERECHA */}
          <div className={styles.right}>
            <section className={styles.card} aria-labelledby="register-title">
              <h2 id="register-title" className={styles.title}>
                Regístrate
              </h2>

              <form
                className={styles.form}
                action={(formData) => {
                  setMessage(null);
                  setErrors({});

                  startTransition(async () => {
                    const res = await registerAction(formData);
                    if (!res.ok) {
                      if (res.errors) setErrors(res.errors);
                      setMessage(
                        res.message ?? "Revisa los campos e inténtalo de nuevo."
                      );
                      return;
                    }

                    setMessage(res.message ?? "Registro completado.");

                    // Limpiar inputs
                    setName("");
                    setEmail("");
                    setPassword("");
                  });
                }}
                noValidate
              >
                {/* Nombre */}
                <div className={styles.field}>
                  <label htmlFor="name" className={styles.label}>
                    Nombre
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className={styles.input}
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    aria-invalid={Boolean(errors.name)}
                  />
                  {errors.name && (
                    <p className={styles.errorText}>{errors.name[0]}</p>
                  )}
                </div>

                {/* Email */}
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={Boolean(errors.email)}
                  />
                  {errors.email && (
                    <p className={styles.errorText}>{errors.email[0]}</p>
                  )}
                </div>

                {/* PASSWORD */}
                <div className={styles.field}>
                  <label htmlFor="password" className={styles.label}>
                    Contraseña
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Mínimo 8 caracteres alfanuméricos"
                    className={styles.input}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-invalid={Boolean(errors.password)}
                  />
                  {errors.password && (
                    <p className={styles.errorText}>{errors.password[0]}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className={styles.button}
                  disabled={pending}
                >
                  {pending ? "Registrando..." : "Registrarse"}
                </button>
              </form>

              {message && (
                <div className={styles.success} aria-live="polite">
                  {message}
                </div>
              )}

              <div className={styles.divider} />
              <p className={styles.footer}>
                ¿Ya tienes una cuenta?{" "}
                <button
                  type="button"
                  onClick={() => router.replace("/login")}
                  className={styles.link}
                >
                  Iniciar sesión
                </button>
              </p>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
