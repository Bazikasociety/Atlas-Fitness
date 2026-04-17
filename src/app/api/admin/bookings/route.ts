import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET — Liste toutes les réservations
export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: { client: { select: { name: true, email: true, phone: true } } },
      orderBy: { date: "asc" },
    });
    return NextResponse.json(bookings);
  } catch (err) {
    console.error("[Admin /bookings GET]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PATCH — Mise à jour du statut d'une réservation
export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: "Champs requis" }, { status: 400 });
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("[Admin /bookings PATCH]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
