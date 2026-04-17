import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { prisma } from "@/lib/prisma";

// GET — Génère et télécharge un fichier Excel avec 4 feuilles
export async function GET() {
  try {
    const [clients, bookings, quizResponses, articles] = await Promise.all([
      prisma.client.findMany({
        include: {
          quizResponses: { orderBy: { createdAt: "desc" }, take: 1 },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.booking.findMany({
        include: { client: { select: { name: true } } },
        orderBy: { date: "asc" },
      }),
      prisma.quizResponse.findMany({
        where: { email: { not: null } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.article.findMany({ orderBy: { publishedAt: "desc" } }),
    ]);

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Atlas Fitness";
    workbook.created = new Date();

    // Styles réutilisables
    const headerFill: ExcelJS.Fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF22C55E" },
    };
    const headerFont: Partial<ExcelJS.Font> = { bold: true, color: { argb: "FF000000" } };

    const addHeaders = (sheet: ExcelJS.Worksheet, headers: string[]) => {
      const row = sheet.addRow(headers);
      row.eachCell((cell) => {
        cell.fill = headerFill;
        cell.font = headerFont;
        cell.alignment = { vertical: "middle" };
      });
      sheet.getRow(1).height = 22;
    }

    // ─── Feuille 1 : Clients actifs ───────────────────────────────────────────
    const wsClients = workbook.addWorksheet("Clients");
    wsClients.columns = [
      { key: "id", width: 20 },
      { key: "name", width: 22 },
      { key: "email", width: 28 },
      { key: "phone", width: 16 },
      { key: "createdAt", width: 14 },
      { key: "subscriptionStatus", width: 16 },
      { key: "currentPeriodEnd", width: 18 },
      { key: "totalPaid", width: 12 },
      { key: "quizScore", width: 12 },
      { key: "notes", width: 40 },
    ];
    addHeaders(wsClients, [
      "ID", "Nom", "Email", "Téléphone", "Date inscription",
      "Statut Stripe", "Prochain paiement", "Total payé (€)", "Score quiz", "Notes",
    ]);
    clients.forEach((c) => {
      wsClients.addRow({
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        createdAt: c.createdAt.toLocaleDateString("fr-FR"),
        subscriptionStatus: c.subscriptionStatus ?? "—",
        currentPeriodEnd: c.currentPeriodEnd
          ? c.currentPeriodEnd.toLocaleDateString("fr-FR")
          : "—",
        totalPaid: c.totalPaid / 100,
        quizScore: c.quizResponses[0]?.totalScore?.toFixed(1) ?? "—",
        notes: c.notes ?? "",
      });
    });

    // ─── Feuille 2 : Prospects quiz ───────────────────────────────────────────
    const wsProspects = workbook.addWorksheet("Prospects Quiz");
    wsProspects.columns = [
      { key: "email", width: 28 },
      { key: "createdAt", width: 16 },
      { key: "totalScore", width: 12 },
      { key: "answers", width: 60 },
    ];
    addHeaders(wsProspects, ["Email", "Date", "Score /20", "Détail réponses"]);
    quizResponses.forEach((r) => {
      wsProspects.addRow({
        email: r.email ?? "",
        createdAt: r.createdAt.toLocaleDateString("fr-FR"),
        totalScore: r.totalScore.toFixed(1),
        answers: JSON.stringify(r.answers),
      });
    });

    // ─── Feuille 3 : Réservations ─────────────────────────────────────────────
    const wsBookings = workbook.addWorksheet("Réservations");
    wsBookings.columns = [
      { key: "date", width: 14 },
      { key: "timeSlot", width: 10 },
      { key: "clientName", width: 22 },
      { key: "email", width: 28 },
      { key: "phone", width: 16 },
      { key: "type", width: 18 },
      { key: "status", width: 12 },
      { key: "comment", width: 40 },
    ];
    addHeaders(wsBookings, [
      "Date", "Créneau", "Client", "Email", "Téléphone", "Type", "Statut", "Commentaire",
    ]);
    bookings.forEach((b) => {
      wsBookings.addRow({
        date: b.date.toLocaleDateString("fr-FR"),
        timeSlot: b.timeSlot,
        clientName: b.name,
        email: b.email,
        phone: b.phone,
        type: b.type === "subscription" ? "Forfait 150€" : "Découverte",
        status: b.status,
        comment: b.comment ?? "",
      });
    });

    // ─── Feuille 4 : Articles ─────────────────────────────────────────────────
    const wsArticles = workbook.addWorksheet("Articles");
    wsArticles.columns = [
      { key: "title", width: 50 },
      { key: "category", width: 16 },
      { key: "publishedAt", width: 14 },
      { key: "views", width: 10 },
      { key: "readingTime", width: 14 },
      { key: "featured", width: 10 },
    ];
    addHeaders(wsArticles, ["Titre", "Catégorie", "Publié le", "Vues", "Temps lecture", "Mis en avant"]);
    articles.forEach((a) => {
      wsArticles.addRow({
        title: a.title,
        category: a.category,
        publishedAt: a.publishedAt.toLocaleDateString("fr-FR"),
        views: a.views,
        readingTime: `${a.readingTime} min`,
        featured: a.featured ? "Oui" : "Non",
      });
    });

    // Génère le buffer
    const buffer = await workbook.xlsx.writeBuffer();
    const date = new Date().toISOString().split("T")[0];

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="atlas-fitness-${date}.xlsx"`,
      },
    });
  } catch (err) {
    console.error("[Admin /export GET]", err);
    return NextResponse.json({ error: "Erreur génération Excel" }, { status: 500 });
  }
}
