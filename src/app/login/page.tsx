"use client";

import { FormEvent, useState } from "react";
import { signIn, getCsrfToken } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("demo@finwise.dev");
  const [password, setPassword] = useState("Demo123!");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const csrfToken = await getCsrfToken();
      const res = await signIn("credentials", {
        email,
        password,
        csrfToken: csrfToken ?? undefined,
        redirect: false,
        callbackUrl: "/welcome",
      });

      if (res?.error) {
        setError("Email o contraseña incorrectos. Verifica tus datos e inténtalo de nuevo.");
      } else if (res?.url) {
        window.location.href = res.url;
      } else {
        setError("No se pudo completar el inicio de sesión.");
      }
    } catch {
      setError("Error inesperado, intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-md mx-auto p-6 mt-24">
      <h1 className="text-3xl font-semibold mb-4">Iniciar sesión</h1>
      <p className="text-gray-600 mb-6">
        Usa el usuario demo para explorar el dashboard.
      </p>
      <form onSubmit={submit} className="grid gap-4">
        <input
          className="border rounded px-3 py-2"
          placeholder="Email"
          aria-label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border rounded px-3 py-2"
          placeholder="Password"
          aria-label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          className="bg-black text-white rounded px-3 py-2 disabled:opacity-60"
          disabled={loading}
          type="submit"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}
