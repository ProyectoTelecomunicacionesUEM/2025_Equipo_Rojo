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
  const [password, setPassword] = useState("");
  
  // Estado para el ojito
  const [showPassword, setShowPassword] = useState(false);

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

      {/* CONTENIDO PRINCIPAL */}
      <section className={styles.page}>
        <div className={styles.split}>
          {/* COLUMNA IZQUIERDA (Imagen) */}
          <div className={styles.left}>
            <Image
              src="/images/tabletTransparente.png"
              alt="Registro de usuario"
              width={2500}
              height={2500}
              className={styles.heroImg} // Cambiado a heroImg para que coincida con el CSS del Login
              priority
            />
          </div>

          {/* COLUMNA DERECHA (La Caja) */}
          <section className={styles.right}>
            <div className={styles.card} aria-labelledby="register-title">
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
                    setName("");
                    setEmail("");
                    setPassword("");
                  });
                }}
                noValidate
              >
                {/* NOMBRE */}
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
                    <p className={styles.errorText} style={{color: 'red', fontSize: '12px', marginTop: '4px'}}>{errors.name[0]}</p>
                  )}
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={Boolean(errors.email)}
                  />
                  {errors.email && (
                    <p className={styles.errorText} style={{color: 'red', fontSize: '12px', marginTop: '4px'}}>{errors.email[0]}</p>
                  )}
                </div>

                {/* CONTRASEÑA CON OJITO */}
                <div className={styles.field}>
                  <label htmlFor="password" className={styles.label}>
                    Contraseña
                  </label>
                  <div className={styles.passwordWrapper}>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 8 caracteres"
                      className={styles.input}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      aria-invalid={Boolean(errors.password)}
                    />
                    <button
                      type="button"
                      className={styles.eyeButton}
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                  {errors.password && (
                    <p className={styles.errorText} style={{color: 'red', fontSize: '12px', marginTop: '4px'}}>{errors.password[0]}</p>
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
                <div className={styles.success} style={{marginTop: '10px', textAlign: 'center', fontWeight: 'bold'}}>
                  {message}
                </div>
              )}

              {/* DIVIDER Y FOOTER IGUAL QUE LOGIN */}
              <div className={styles.divider} style={{margin: '20px 0', borderTop: '1px solid var(--border)'}} />
              
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
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}