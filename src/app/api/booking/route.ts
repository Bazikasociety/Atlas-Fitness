import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);

// POST — Crée une réservation. Le paiement PayPal (si forfait) est géré côté client.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, comment, type, date, timeSlot } = body as {
      name: string;
      email: string;
      phone: string;
      comment?: string;
      type: "discovery" | "subscription";
      date: string;
      timeSlot: string;
    };

    // Validation minimale
    if (!name || !email || !phone || !date || !timeSlot || !type) {
      return NextResponse.json(
        { error: "Champs requis manquants" },
        { status: 400 }
      );
    }

    // Cherche ou crée le client
    let client = await prisma.client.findUnique({ where: { email } });
    if (!client) {
      client = await prisma.client.create({
        data: { name, email, phone },
      });
    }

    // Crée la réservation
    const booking = await prisma.booking.create({
      data: {
        clientId: client.id,
        name,
        email,
        phone,
        date: new Date(date),
        timeSlot,
        comment: comment ?? null,
        type,
        status: "pending",
      },
    });

    // Email de confirmation client
    try {
      await resend.emails.send({
        from: "Atlas Fitness <noreply@atlasfitness.fr>",
        to: email,
        subject:
          type === "subscription"
            ? "🏋️ Votre demande de forfait — Atlas Fitness"
            : "🏋️ Votre séance découverte — Atlas Fitness",
        html: `
          <div style="font-family:sans-serif;background:#0A0A0A;color:#FAFAFA;padding:40px;max-width:600px;margin:0 auto;">
            <h1 style="font-size:2rem;margin-bottom:8px;">ATLAS FITNESS</h1>
            <p style="color:#22C55E;text-transform:uppercase;letter-spacing:.2em;font-size:.75rem;">Confirmation de réservation</p>
            <hr style="border-color:#1F1F1F;margin:24px 0;">
            <p>Bonjour <strong>${name}</strong>,</p>
            <p>Votre demande de ${
              type === "subscription"
                ? "forfait remise en forme"
                : "séance découverte"
            } a bien été reçue.</p>
            <p><strong>Date souhaitée :</strong> ${new Date(date).toLocaleDateString(
              "fr-FR",
              {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )} à ${timeSlot.replace("H", "h")}</p>
            ${comment ? `<p><strong>Commentaire :</strong> ${comment}</p>` : ""}
            <p>Je vous recontacte sous 24h pour confirmer votre créneau.</p>
            <hr style="border-color:#1F1F1F;margin:24px 0;">
            <p style="color:#A1A1AA;font-size:.875rem;">Yann Bazika · Atlas Fitness<br>societebazika@gmail.com</p>
          </div>
        `,
      });
    } catch {
      // Email non bloquant
    }

    // Email notification coach
    try {
      await resend.emails.send({
        from: "Atlas Fitness <noreply@atlasfitness.fr>",
        to: process.env.ADMIN_EMAIL!,
        subject: `🔔 Nouvelle réservation — ${name}`,
        html: `
          <p><strong>Type :</strong> ${
            type === "subscription" ? "Forfait 150€" : "Découverte gratuite"
          }</p>
          <p><strong>Client :</strong> ${name} (${email} — ${phone})</p>
          <p><strong>Date :</strong> ${new Date(date).toLocaleDateString(
            "fr-FR"
          )} à ${timeSlot}</p>
          ${comment ? `<p><strong>Note :</strong> ${comment}</p>` : ""}
          <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin">Voir dans l'admin →</a></p>
        `,
      });
    } catch {
      // Email non bloquant
    }

    return NextResponse.json({
      success: true,
      bookingId: booking.id,
      type,
    });
  } catch (err) {
    console.error("[API /booking] Erreur:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
