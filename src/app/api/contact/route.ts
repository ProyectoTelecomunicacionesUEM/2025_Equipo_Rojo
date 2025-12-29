import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { nombre, correo, telefono, mensaje, token } = await req.json();

    if (!nombre || !correo || !mensaje || !token) {
      return NextResponse.json(
        { ok: false, error: "Faltan datos o captcha" },
        { status: 400 }
      );
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY!;
    const verifyRes = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: secretKey,
          response: token,
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

    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM!,
      to: process.env.CONTACT_TO!,
      subject: `Nuevo mensaje de contacto: ${nombre}`,
      replyTo: correo,
      html: `
        <h2>Nuevo mensaje desde la web</h2>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Correo:</strong> ${correo}</p>
        <p><strong>Teléfono:</strong> ${telefono || "No indicado"}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${mensaje.replace(/\n/g, "<br/>")}</p>
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
