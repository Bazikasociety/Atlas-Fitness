import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify, readingTime } from "@/lib/utils";

// GET — Liste tous les articles
export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      orderBy: { publishedAt: "desc" },
    });
    return NextResponse.json(articles);
  } catch (err) {
    console.error("[Admin /articles GET]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST — Crée un nouvel article
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, excerpt, content, category, coverImage, featured } = body;

    if (!title || !content || !category) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }

    const slug = slugify(title);
    const rt = readingTime(content);

    const article = await prisma.article.create({
      data: {
        slug,
        title,
        excerpt: excerpt ?? content.slice(0, 160),
        content,
        category,
        coverImage: coverImage ?? "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800",
        readingTime: rt,
        featured: featured ?? false,
      },
    });

    return NextResponse.json(article, { status: 201 });
  } catch (err) {
    console.error("[Admin /articles POST]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PUT — Met à jour un article
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, title, excerpt, content, category, coverImage, featured } = body;

    if (!id) return NextResponse.json({ error: "ID requis" }, { status: 400 });

    const slug = title ? slugify(title) : undefined;
    const rt = content ? readingTime(content) : undefined;

    const updated = await prisma.article.update({
      where: { id },
      data: {
        ...(title && { title, slug }),
        ...(excerpt && { excerpt }),
        ...(content && { content, readingTime: rt }),
        ...(category && { category }),
        ...(coverImage && { coverImage }),
        ...(featured !== undefined && { featured }),
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("[Admin /articles PUT]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE — Supprime un article
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID requis" }, { status: 400 });

    await prisma.article.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Admin /articles DELETE]", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
