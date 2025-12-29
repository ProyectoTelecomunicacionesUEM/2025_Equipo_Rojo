"use client";

import * as React from "react";
import ReCAPTCHA from "react-google-recaptcha";

export default function ContactForm() {
  // ❌ NO usar "!" — puede ser undefined en runtime
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  const [captchaToken, setCaptchaToken] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!captchaToken) {
      setError("Por favor, verifica el reCAPTCHA.");
      return;
    }

    const form = e.currentTarget;
    const fd = new FormData(form);

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: String(fd.get("nombre")),
          correo: String(fd.get("correo")),
          telefono: String(fd.get("telefono") || ""),
          mensaje: String(fd.get("mensaje")),
          privacidad: fd.get("privacidad") === "on",
          token: captchaToken,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data?.error ?? "Error al enviar el mensaje");
      }

      setSuccess(true);
      form.reset();
      setCaptchaToken(null);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Error al enviar. Intenta de nuevo.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className="bg-white p-6 md:p-8 rounded-lg shadow-md space-y-4"
      onSubmit={handleSubmit}
      noValidate
    >
      {/* NOMBRE */}
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="nombre">
          Nombre*
        </label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          required
          className="w-full border-2 border-orange-500 p-3 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
          placeholder="Tu nombre"
        />
      </div>

      {/* CORREO */}
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="correo">
          Correo*
        </label>
        <input
          id="correo"
          name="correo"
          type="email"
          required
          className="w-full border-2 border-orange-500 p-3 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
          placeholder="tu@correo.com"
        />
      </div>

      {/* TELÉFONO */}
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="telefono">
          Teléfono
        </label>
        <input
          id="telefono"
          name="telefono"
          type="tel"
          className="w-full border-2 border-orange-500 p-3 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
          placeholder="+34 600 000 000"
        />
      </div>

      {/* MENSAJE */}
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="mensaje">
          Mensaje*
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          required
          className="w-full border-2 border-orange-500 p-3 rounded h-32 resize-y focus:outline-none focus:ring-2 focus:ring-orange-400"
          placeholder="Cuéntanos en qué podemos ayudarte"
        />
      </div>

      {/* PRIVACIDAD */}
      <div className="flex items-start gap-2 text-sm">
        <input
          id="privacidad"
          name="privacidad"
          type="checkbox"
          required
          className="mt-1"
        />
        <label htmlFor="privacidad">
          He leído y acepto la{" "}
          <a
            href="/politica-privacidad"
            className="underline text-orange-600 hover:text-orange-700"
          >
            Política de Privacidad de Datos
          </a>
          .
        </label>
      </div>

      {/* RECAPTCHA */}
      {!siteKey && (
        <p className="text-red-600 text-sm">
          Falta configurar reCAPTCHA en el servidor.
        </p>
      )}

      {siteKey && (
        <ReCAPTCHA
          sitekey={siteKey}
          onChange={(token) => setCaptchaToken(token)}
          onExpired={() => setCaptchaToken(null)}
          hl="es"
        />
      )}

      {/* MENSAJES */}
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {success && (
        <p className="text-green-600 text-sm">
          ¡Mensaje enviado correctamente!
        </p>
      )}

      {/* BOTÓN */}
      <button
        type="submit"
        disabled={!captchaToken || loading}
        className={`bg-orange-500 text-white font-bold py-3 px-6 rounded w-full transition-colors ${
          !captchaToken || loading
            ? "opacity-60 cursor-not-allowed"
            : "hover:bg-orange-600"
        }`}
      >
        {loading ? "Enviando..." : "Enviar mensaje"}
      </button>
    </form>
  );
}
