"use client";

import * as React from "react";
import ReCAPTCHA from "react-google-recaptcha";

export default function ContactForm() {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const recaptchaRef = React.useRef<ReCAPTCHA | null>(null);

  const [telefonoView, setTelefonoView] = React.useState("");
  const [emailView, setEmailView] = React.useState(""); 
  const [captchaToken, setCaptchaToken] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  // ---------- TELÉFONO ----------
  function handleTelefonoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    const  cleaned = raw.replace(/[^\d+]/g, "").replace(/(?!^)\+/g, "");
    const hasPlus = cleaned.startsWith("+");
    let digits = cleaned.replace(/[^\d]/g, "");

    if (hasPlus && digits.startsWith("34")) {
      const rest = digits.slice(2, 11);
      digits = "34" + rest;
    } else if (hasPlus) {
      digits = digits.slice(0, 15);
    } else {
      digits = digits.slice(0, 9);
    }

    let formatted: string;
    if (hasPlus && digits.startsWith("34")) {
      const rest = digits.slice(2);
      formatted = "+34 " + rest.replace(/(\d{3})(?=\d)/g, "$1 ").trim();
    } else if (hasPlus) {
      formatted = "+" + digits;
    } else {
      formatted = digits.replace(/(\d{3})(?=\d)/g, "$1 ").trim();
    }

    if (!hasPlus && digits.length === 0) formatted = "";

    setTelefonoView(formatted);
  }

  function allowNumericOnly(e: React.KeyboardEvent<HTMLInputElement>) {
    const input = e.currentTarget;
    const value = input.value;
    const start = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? start;
    const selLen = end - start;

    const allowed =
      /[0-9]/.test(e.key) ||
      ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Home", "End"].includes(e.key) ||
      (e.key === "+" && start === 0 && !value.startsWith("+"));

    if (!allowed) {
      e.preventDefault();
      return;
    }

    const normalized = value.replace(/\s+/g, "");
    const hasPlus = normalized.startsWith("+");
    const onlyDigits = normalized.replace(/[^\d]/g, "");
    const isSpainPrefix = hasPlus && onlyDigits.startsWith("34");

    let nationalDigitsCount = 0;
    if (isSpainPrefix) nationalDigitsCount = Math.max(onlyDigits.length - 2, 0);
    else if (!hasPlus) nationalDigitsCount = onlyDigits.length;
    else nationalDigitsCount = onlyDigits.length;

    const maxDigits = isSpainPrefix ? 9 : (!hasPlus ? 9 : 15);
    if (/^[0-9]$/.test(e.key) && selLen === 0 && nationalDigitsCount >= maxDigits) {
      e.preventDefault();
      return;
    }
  }

  function handleTelefonoPaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text") ?? "";
    const input = e.currentTarget;
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? input.value.length;
    const next = input.value.slice(0, start) + pasted + input.value.slice(end);
    const fakeEvent = { target: { value: next } } as unknown as React.ChangeEvent<HTMLInputElement>;
    handleTelefonoChange(fakeEvent);
  }

  function getTelefonoNormalizado(value: string) {
    return value.replace(/\s+/g, "");
  }

  function isTelefonoEspanolValido(value: string) {
    const n = getTelefonoNormalizado(value);
    return /^(?:\+34)?(?:[67]\d{8}|9\d{8})$/.test(n);
  }

  // ---------- CORREO ----------
  function normalizeEmail(value: string) {
    const trimmed = value.trim();
    const atIdx = trimmed.indexOf("@");
    if (atIdx === -1) return trimmed;
    const local = trimmed.slice(0, atIdx);
    const domain = trimmed.slice(atIdx + 1).toLowerCase();
    return `${local}@${domain}`;
  }

  function isEmailValido(value: string) {
    const v = normalizeEmail(value);
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  }

  // ---------- SUBMIT ----------
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

    const correoRaw = emailView || String(fd.get("correo") || "");
    const correo = normalizeEmail(correoRaw);
    if (!isEmailValido(correo)) {
      setError("Correo inválido. Revisa el formato (ejemplo: usuario@dominio.com).");
      return;
    }

    const telefonoRaw = telefonoView || String(fd.get("telefono") || "");
    const telefono = getTelefonoNormalizado(telefonoRaw);
    const validoTel = isTelefonoEspanolValido(telefono);
    if (!validoTel) {
      setError(
        "Teléfono inválido. Debe ser español (móvil 6/7 o fijo 9) con 9 dígitos. Puedes empezar por +34."
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: String(fd.get("nombre")),
          correo,
          telefono,
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
      setTelefonoView("");
      setEmailView("");
      setCaptchaToken(null);
      recaptchaRef.current?.reset();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al enviar. Intenta de nuevo.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  const telefonoEsValido = telefonoView === "" || isTelefonoEspanolValido(telefonoView);
  const emailEsValido = emailView === "" || isEmailValido(emailView);

  return (
    <form className="bg-white p-6 md:p-8 rounded-lg shadow-md space-y-4" onSubmit={handleSubmit} noValidate>
      {/* NOMBRE */}
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="nombre">Nombre*</label>
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
        <label className="block text-sm font-medium mb-1" htmlFor="correo">Correo*</label>
        <input
          id="correo"
          name="correo"
          type="email"
          required
          value={emailView}
          onChange={(e) => setEmailView(e.target.value)}
          onBlur={(e) => setEmailView(normalizeEmail(e.target.value))}
          pattern="^[^\s@]+@[^\s@]+\.[^\s@]{2,}$"
          className={`w-full border-2 p-3 rounded focus:outline-none focus:ring-2 focus:ring-orange-400 ${
            emailEsValido ? "border-orange-500" : "border-red-500"
          }`}
          placeholder="tu@correo.com"
          title="Introduce un correo válido (ejemplo: usuario@dominio.com)"
          aria-invalid={!emailEsValido}
        />
      </div>

      {/* TELÉFONO */}
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="telefono">Teléfono</label>
        <input
          id="telefono"
          name="telefono"
          type="tel"
          inputMode="numeric"
          value={telefonoView}
          onChange={handleTelefonoChange}
          onKeyDown={allowNumericOnly}
          onPaste={handleTelefonoPaste}
          pattern="(?:\+34)?(?:[67]\d{8}|9\d{8})"
          maxLength={20}
          className={`w-full border-2 p-3 rounded focus:outline-none focus:ring-2 focus:ring-orange-400 ${
            telefonoEsValido ? "border-orange-500" : "border-red-500"
          }`}
          placeholder="+34 600 000 000"
          title="Teléfono español: 9 dígitos empezando por 6/7/9. +34 opcional."
          aria-invalid={!telefonoEsValido}
        />
      </div>

      {/* MENSAJE */}
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="mensaje">Mensaje*</label>
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
        <input id="privacidad" name="privacidad" type="checkbox" required className="mt-1" />
        <label htmlFor="privacidad">
          He leído y acepto la{" "}
          <a href="/politica-privacidad" className="underline text-orange-600">Política de Privacidad de Datos</a>.
        </label>
      </div>

      {/* RECAPTCHA */}
      {!siteKey && <p className="text-red-600 text-sm">Falta configurar reCAPTCHA en el servidor.</p>}
      {siteKey && (
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={siteKey}
          onChange={(token) => setCaptchaToken(token)}
          onExpired={() => {
            setCaptchaToken(null);
            recaptchaRef.current?.reset();
          }}
          hl="es"
        />
      )}

      {/* MENSAJES */}
      {error && <p className="text-red-600 text-lg font-semibold">{error}</p>}
      {success && <p className="text-green-600 text-lg font-semibold">¡Mensaje enviado correctamente!</p>}

      {/* BOTÓN */}
      <button
        type="submit"
        disabled={!captchaToken || loading}
        className={`bg-orange-500 text-white font-bold py-3 px-6 rounded w-full transition-colors ${
          !captchaToken || loading ? "opacity-60 cursor-not-allowed" : "hover:bg-orange-600"
        }`}
      >
        {loading ? "Enviando..." : "Enviar mensaje"}
      </button>
    </form>
  );
}
