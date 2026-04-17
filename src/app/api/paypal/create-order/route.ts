import { NextRequest, NextResponse } from "next/server";
import { createPayPalOrder, isPayPalConfigured } from "@/lib/paypal";
import { prisma } from "@/lib/prisma";

// POST — Crée un ordre PayPal pour une réservation existante
export async function POST(req: NextRequest) {
  try {
    const { bookingId } = (await req.json()) as { bookingId: string };

    if (!bookingId) {
      return NextResponse.json(
        { error: "bookingId requis" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Réservation introuvable" },
        { status: 404 }
      );
    }

    if (!isPayPalConfigured()) {
      return NextResponse.json(
        { error: "PayPal non configuré côté serveur" },
        { status: 503 }
      );
    }

    const order = await createPayPalOrder({
      amount: 150,
      description: "Forfait Remise en Forme — Atlas Fitness (1 mois)",
      bookingId: booking.id,
    });

    return NextResponse.json({ orderId: order.id });
  } catch (err) {
    console.error("[PayPal create-order] Erreur:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur serveur" },
      { status: 500 }
    );
  }
}
