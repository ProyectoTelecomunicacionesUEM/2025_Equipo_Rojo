
import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs"; // asegúrate de no usar 'edge' para Resend

export async function POST(req: Request) {
  try {
    const { nombre, correo, telefono, mensaje, token } = await req.json();

    // Validación básica de payload
    if (!nombre || !correo || !mensaje || !token) {
      return NextResponse.json(
        { ok: false, error: "Faltan datos o captcha" },
        { status: 400 }
      );
    }

    // Verificación reCAPTCHA
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { ok: false, error: "Falta RECAPTCHA_SECRET_KEY" },
        { status: 500 }
      );
    }

    const verifyRes = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: secretKey,
          response: token,
          // remoteip opcional
        }),
      }
    );

    const verifyData = await verifyRes.json();

    if (verifyData.success) {
      return NextResponse.json(
        { ok: false, error: "Captcha inválido" },
        { status: 400 }
      );
    }

    // Inicializa Resend dentro del handler (evita evaluar en build)
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.CONTACT_FROM;
    const to = process.env.CONTACT_TO;

    if (!apiKey || !from || !to) {
      return NextResponse.json(
        { ok: false, error: "Faltan variables de entorno (RESEND_API_KEY, CONTACT_FROM, CONTACT_TO)" },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from,
      to,
      subject: `Nuevo mensaje de contacto: ${nombre}`,
      replyTo: correo,
      html: `
        <h2>Nuevo mensaje desde la web</h2>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Correo:</strong> ${correo}</p>
        <p><strong>Teléfono:</strong> ${telefono || "No indicado"}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${String(mensaje).replace(/\n/g, "<br/>")}</p>
      `,
    });

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: "Error interno" },
      { status: 500 }
    );
  }
}
