import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

// App Router Next.js 14 : pas de body parsing auto, req.text() fonctionne nativement
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // Initialisation lazy — Stripe non utilisé en prod (PayPal actif)
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe non configuré" }, { status: 503 });
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-03-25.dahlia" as Parameters<typeof Stripe>[1]["apiVersion"],
  });
  const resend = new Resend(process.env.RESEND_API_KEY);
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Signature manquante" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("[Stripe Webhook] Signature invalide:", err);
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  try {
    switch (event.type) {
      // Paiement initial réussi
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const { bookingId, clientId } = session.metadata ?? {};

        // Met à jour la réservation
        if (bookingId) {
          await prisma.booking.update({
            where: { id: bookingId },
            data: { status: "paid" },
          });
        }

        // Met à jour le client avec les infos Stripe
        if (clientId && session.customer) {
          await prisma.client.update({
            where: { id: clientId },
            data: {
              stripeCustomerId: session.customer as string,
              subscriptionId: session.subscription as string,
              subscriptionStatus: "active",
            },
          });
        }

        // Email de bienvenue
        if (session.customer_email) {
          await resend.emails.send({
            from: "Atlas Fitness <noreply@atlasfitness.pro>",
            to: session.customer_email,
            subject: "🎉 Paiement confirmé — Atlas Fitness",
            html: `
              <div style="font-family:sans-serif;background:#0A0A0A;color:#FAFAFA;padding:40px;max-width:600px;">
                <h1 style="margin-bottom:8px;">ATLAS FITNESS</h1>
                <p style="color:#22C55E;">Forfait Remise en Forme activé !</p>
                <p>Votre paiement de <strong>150€/mois</strong> a été confirmé. Bienvenue dans Atlas Fitness !</p>
                <p>Yann vous recontactera très prochainement pour démarrer votre programme.</p>
                <p style="color:#A1A1AA;font-size:.875rem;">societebazika@gmail.com</p>
              </div>
            `,
          }).catch(() => {});
        }
        break;
      }

      // Renouvellement mensuel réussi
      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.customer) {
          const client = await prisma.client.findUnique({
            where: { stripeCustomerId: invoice.customer as string },
          });
          if (client) {
            await prisma.client.update({
              where: { id: client.id },
              data: {
                totalPaid: { increment: invoice.amount_paid },
                subscriptionStatus: "active",
              },
            });
          }
        }
        break;
      }

      // Abonnement annulé ou expiré
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const client = await prisma.client.findFirst({
          where: { subscriptionId: subscription.id },
        });
        if (client) {
          await prisma.client.update({
            where: { id: client.id },
            data: { subscriptionStatus: "canceled" },
          });
        }
        break;
      }

      // Paiement en attente de renouvellement
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const client = await prisma.client.findFirst({
          where: { subscriptionId: sub.id },
        });
        if (client) {
          await prisma.client.update({
            where: { id: client.id },
            data: {
              subscriptionStatus: sub.status,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              currentPeriodEnd: new Date(((sub as any).current_period_end ?? 0) * 1000),
            },
          });
        }
        break;
      }

      default:
        // Événement ignoré
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[Stripe Webhook] Erreur traitement:", err);
    return NextResponse.json({ error: "Erreur traitement" }, { status: 500 });
  }
}
