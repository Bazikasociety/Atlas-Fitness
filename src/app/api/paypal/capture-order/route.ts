import { NextRequest, NextResponse } from "next/server";
import { capturePayPalOrder } from "@/lib/paypal";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);

// POST — Capture un ordre PayPal approuvé et met à jour la DB
export async function POST(req: NextRequest) {
  try {
    const { orderId } = (await req.json()) as { orderId: string };

    if (!orderId) {
      return NextResponse.json(
        { error: "orderId requis" },
        { status: 400 }
      );
    }

    const capture = await capturePayPalOrder(orderId);

    if (capture.status !== "COMPLETED") {
      return NextResponse.json(
        { error: `Paiement non complété (${capture.status})` },
        { status: 402 }
      );
    }

    // Met à jour la réservation
    if (capture.bookingId) {
      const booking = await prisma.booking.update({
        where: { id: capture.bookingId },
        data: { status: "paid" },
      });

      // Met à jour le client
      if (booking.clientId) {
        await prisma.client.update({
          where: { id: booking.clientId },
          data: {
            subscriptionStatus: "active",
            totalPaid: { increment: Math.round(parseFloat(capture.amount) * 100) },
          },
        });
      }

      // Email bienvenue
      if (booking.email) {
        await resend.emails
          .send({
            from: "Atlas Fitness <noreply@atlasfitness.fr>",
            to: booking.email,
            subject: "🎉 Paiement confirmé — Atlas Fitness",
            html: `
              <div style="font-family:sans-serif;background:#0A0A0A;color:#FAFAFA;padding:40px;max-width:600px;margin:0 auto;">
                <h1 style="font-size:2rem;margin-bottom:8px;">ATLAS FITNESS</h1>
                <p style="color:#22C55E;text-transform:uppercase;letter-spacing:.2em;font-size:.75rem;">Forfait activé</p>
                <hr style="border-color:#1F1F1F;margin:24px 0;">
                <p>Bonjour <strong>${booking.name}</strong>,</p>
                <p>Votre paiement de <strong>${capture.amount} ${capture.currency}</strong> via PayPal a bien été reçu.</p>
                <p>Yann vous recontactera très prochainement pour démarrer votre programme.</p>
                <hr style="border-color:#1F1F1F;margin:24px 0;">
                <p style="color:#A1A1AA;font-size:.875rem;">societebazika@gmail.com</p>
              </div>
            `,
          })
          .catch(() => {});
      }

      // Notification coach
      if (process.env.ADMIN_EMAIL) {
        await resend.emails
          .send({
            from: "Atlas Fitness <noreply@atlasfitness.fr>",
            to: process.env.ADMIN_EMAIL,
            subject: `💰 Paiement reçu — ${booking.name}`,
            html: `
              <p><strong>Client :</strong> ${booking.name} (${booking.email})</p>
              <p><strong>Montant :</strong> ${capture.amount} ${capture.currency}</p>
              <p><strong>PayPal :</strong> ${capture.payerEmail ?? "—"}</p>
              <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin">Voir dans l'admin →</a></p>
            `,
          })
          .catch(() => {});
      }
    }

    return NextResponse.json({
      success: true,
      status: capture.status,
      amount: capture.amount,
    });
  } catch (err) {
    console.error("[PayPal capture-order] Erreur:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur serveur" },
      { status: 500 }
    );
  }
}
