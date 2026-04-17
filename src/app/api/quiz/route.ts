import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST — Sauvegarde une réponse quiz en base de données
// Body: { answers: Record<string, number>, totalScore: number, email?: string }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { answers, totalScore, email } = body as {
      answers: Record<string, number>;
      totalScore: number;
      email?: string;
    };

    if (typeof totalScore !== "number" || !answers) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    // Recherche d'un client existant si email fourni
    let clientId: string | undefined;
    if (email) {
      const existingClient = await prisma.client.findUnique({
        where: { email },
      });
      if (existingClient) {
        clientId = existingClient.id;
      }
    }

    // Sauvegarde de la réponse quiz
    // Note : SQLite ne supporte pas le type Json — on sérialise en JSON string
    const quizResponse = await prisma.quizResponse.create({
      data: {
        email: email ?? null,
        answers: JSON.stringify(answers),
        totalScore,
        ...(clientId ? { clientId } : {}),
      },
    });

    return NextResponse.json({ success: true, id: quizResponse.id });
  } catch (err) {
    console.error("[API /quiz] Erreur:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
