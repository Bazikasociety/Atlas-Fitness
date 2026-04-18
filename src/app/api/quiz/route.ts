import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);

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
      const existingClient = await prisma.client.findUnique({ where: { email } });
      if (existingClient) clientId = existingClient.id;
    }

    // Sauvegarde de la réponse quiz
    const quizResponse = await prisma.quizResponse.create({
      data: {
        email: email ?? null,
        answers: JSON.stringify(answers),
        totalScore,
        ...(clientId ? { clientId } : {}),
      },
    });

    // Label du score
    const label =
      totalScore >= 17 ? "EXCELLENT" :
      totalScore >= 13 ? "CORRECT" :
      totalScore >= 8  ? "À AMÉLIORER" :
                         "SIGNAL D'ALARME";

    // Email de notification à Yann (toujours)
    resend.emails.send({
      from: "Atlas Fitness <onboarding@resend.dev>",
      to: process.env.ADMIN_EMAIL!,
      subject: `🧠 Nouveau quiz — Score ${totalScore}/20 ${email ? `(${email})` : "(anonyme)"}`,
      html: `
        <div style="font-family:sans-serif;background:#0A0A0A;color:#FAFAFA;padding:40px;max-width:600px;">
          <h2 style="margin-bottom:4px;">ATLAS FITNESS — Nouveau quiz</h2>
          <p style="color:#22C55E;font-size:.75rem;text-transform:uppercase;letter-spacing:.2em;">${label}</p>
          <hr style="border-color:#1F1F1F;margin:20px 0;">
          <p><strong>Score :</strong> ${totalScore} / 20</p>
          <p><strong>Email :</strong> ${email ?? "Non renseigné"}</p>
          <p><strong>Détail par catégorie :</strong></p>
          <ul style="color:#A1A1AA;font-size:.875rem;">
            ${Object.entries(answers).map(([k, v]) => `<li>${k} : ${v}</li>`).join("")}
          </ul>
          <hr style="border-color:#1F1F1F;margin:20px 0;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin" style="color:#22C55E;">Voir dans l'admin →</a>
        </div>
      `,
    }).catch(() => {});

    // Email de résultat au prospect (si email fourni)
    if (email) {
      resend.emails.send({
        from: "Atlas Fitness <onboarding@resend.dev>",
        to: email,
        subject: `🏋️ Ton bilan fitness — ${totalScore}/20 · Atlas Fitness`,
        html: `
          <div style="font-family:sans-serif;background:#0A0A0A;color:#FAFAFA;padding:40px;max-width:600px;">
            <h1 style="margin-bottom:4px;">ATLAS FITNESS</h1>
            <p style="color:#22C55E;font-size:.75rem;text-transform:uppercase;letter-spacing:.2em;">Ton bilan fitness</p>
            <hr style="border-color:#1F1F1F;margin:20px 0;">
            <p>Tu as obtenu <strong style="font-size:1.5rem;">${totalScore} / 20</strong></p>
            <p style="color:#22C55E;font-weight:bold;">${label}</p>
            <p style="color:#A1A1AA;">Yann analyse tes résultats et peut t'accompagner vers une meilleure forme. Réserve une séance découverte gratuite pour qu'on en discute ensemble.</p>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/reserver" style="display:inline-block;background:#22C55E;color:#000;padding:14px 28px;text-decoration:none;font-weight:bold;margin-top:16px;">
              RÉSERVER UNE SÉANCE GRATUITE →
            </a>
            <hr style="border-color:#1F1F1F;margin:20px 0;">
            <p style="color:#A1A1AA;font-size:.75rem;">Yann Bazika · Atlas Fitness · societebazika@gmail.com</p>
          </div>
        `,
      }).catch(() => {});
    }

    return NextResponse.json({ success: true, id: quizResponse.id });
  } catch (err) {
    console.error("[API /quiz] Erreur:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
