import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET — Liste toutes les réponses quiz
export async function GET() {
  try {
    const responses = await prisma.quizResponse.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        totalScore: true,
        answers: true,
        createdAt: true,
      },
    });
    return NextResponse.json(responses);
  } catch (err) {
    console.error("[Admin /quiz GET]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
