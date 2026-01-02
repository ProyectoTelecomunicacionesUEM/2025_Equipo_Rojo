"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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

  return (
    <main className={styles.wrapper}>
      {/* HEADER (tira azul) */}
      <header className={styles.topbar}>
        <div className={styles.topbarInner}>
          {/* Logo / Nombre de la app */}
          <Link
            href="/"
            className={styles.brand}
            title="Ir a la página principal"
          >
            {process.env.NEXT_PUBLIC_APP_NAME ?? "FrostTrack"}
          </Link>

          {/* Navegación / botón login */}
          <nav className={styles.topbarNav}>
            <button
              type="button"
              onClick={() => router.replace("/login")}
              className={styles.loginLink}
              title="Iniciar sesión en tu cuenta"
            >
              Iniciar sesión
            </button>
          </nav>
        </div>
      </header>

      {/* CONTENIDO SPLIT */}
      <section className={styles.page}>
        <div className={styles.split}>
          {/* Columna izquierda */}
          <div className={styles.left}>
            <img
              src="/images/imagenRegistro.png"
              alt="Registro de usuario"
              className={styles.heroImage}
              title="Imagen ilustrativa del registro de usuario"
            />
          </div>

          {/* Columna derecha: formulario */}
          <div className={styles.right}>
            <section className={styles.card} aria-labelledby="register-title">
              <h2
                id="register-title"
                className={styles.title}
                title="Formulario de registro"
              >
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

                    setMessage(
                      res.message ?? "Te hemos enviado un correo de confirmación."
                    );

                    // Limpiar inputs tras registro correcto
                    setName("");
                    setEmail("");
                  });
                }}
                noValidate
                aria-describedby="form-desc"
              >
                <div id="form-desc" className={styles.srOnly}>
                  Formulario de registro con nombre y correo electrónico
                </div>

                {/* Nombre */}
                <div className={styles.field}>
                  <label
                    htmlFor="name"
                    className={styles.label}
                    title="Tu nombre completo"
                  >
                    Nombre
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Tu nombre"
                    className={styles.input}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {errors.name && (
                    <p
                      id="name-error"
                      className={styles.errorText}
                      aria-live="polite"
                    >
                      {errors.name[0]}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className={styles.field}>
                  <label
                    htmlFor="email"
                    className={styles.label}
                    title="Tu correo electrónico"
                  >
                    Correo electrónico
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="tucorreo@empresa.com"
                    className={styles.input}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email && (
                    <p
                      id="email-error"
                      className={styles.errorText}
                      aria-live="polite"
                    >
                      {errors.email[0]}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className={styles.button}
                  disabled={pending}
                    title="Registrarse como usuario"
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
