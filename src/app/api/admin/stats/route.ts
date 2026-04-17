import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET — Statistiques du dashboard admin
export async function GET() {
  try {
    const [
      totalClients,
      activeClients,
      totalBookings,
      pendingBookings,
      totalArticles,
      quizResponses,
      quizWithEmail,
    ] = await Promise.all([
      prisma.client.count(),
      prisma.client.count({ where: { subscriptionStatus: "active" } }),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: "pending" } }),
      prisma.article.count(),
      prisma.quizResponse.findMany({ select: { totalScore: true, email: true } }),
      prisma.quizResponse.count({ where: { email: { not: null } } }),
    ]);

    // MRR = clients actifs × 150€
    const mrr = activeClients * 150;

    // Score moyen du quiz
    const avgQuizScore =
      quizResponses.length > 0
        ? quizResponses.reduce((sum, r) => sum + r.totalScore, 0) / quizResponses.length
        : 0;

    // Taux conversion quiz → réservation (approximatif)
    const conversionRate =
      quizResponses.length > 0
        ? Math.round((totalBookings / quizResponses.length) * 100)
        : 0;

    return NextResponse.json({
      totalClients,
      activeClients,
      mrr,
      totalBookings,
      pendingBookings,
      totalArticles,
      totalQuizResponses: quizResponses.length,
      quizLeads: quizWithEmail,
      avgQuizScore: Math.round(avgQuizScore * 10) / 10,
      conversionRate,
    });
  } catch (err) {
    console.error("[Admin /stats GET]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
