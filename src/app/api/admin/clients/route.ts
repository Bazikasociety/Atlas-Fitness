import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET — Liste tous les clients avec leurs réservations et quiz
export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      include: {
        bookings: { orderBy: { createdAt: "desc" } },
        quizResponses: { orderBy: { createdAt: "desc" }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(clients);
  } catch (err) {
    console.error("[Admin /clients GET]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PATCH — Met à jour les notes ou statut d'un client
export async function PATCH(req: NextRequest) {
  try {
    const { id, notes, subscriptionStatus } = await req.json();
    if (!id) return NextResponse.json({ error: "ID requis" }, { status: 400 });

    const updated = await prisma.client.update({
      where: { id },
      data: {
        ...(notes !== undefined && { notes }),
        ...(subscriptionStatus !== undefined && { subscriptionStatus }),
      },
    });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("[Admin /clients PATCH]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
