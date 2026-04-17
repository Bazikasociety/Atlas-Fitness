import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { formatDate } from "@/lib/utils";

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const articles = await prisma.article.findMany({ select: { slug: true } });
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = await prisma.article.findUnique({
    where: { slug: params.slug },
  });
  if (!article) return { title: "Article introuvable — Atlas Fitness" };

  return {
    title: `${article.title} — Atlas Fitness`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.coverImage],
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const article = await prisma.article.findUnique({
    where: { slug: params.slug },
  });

  if (!article) notFound();

  // Incrément des vues (silencieux — pas bloquant)
  prisma.article
    .update({
      where: { id: article.id },
      data: { views: { increment: 1 } },
    })
    .catch(() => {});

  // Rendu du markdown
  const htmlContent = await marked(article.content, { async: true });

  // Articles suggérés (même catégorie, hors article actuel)
  const related = await prisma.article.findMany({
    where: { category: article.category, slug: { not: article.slug } },
    take: 3,
    orderBy: { publishedAt: "desc" },
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0A0A0A]">

        {/* Hero image plein écran */}
        <section className="relative h-[70vh] min-h-[450px] overflow-hidden" aria-label={article.title}>
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-black/50 to-black/20" />
        </section>

        {/* Contenu article */}
        <article className="max-w-3xl mx-auto px-6 md:px-12 -mt-24 relative z-10">

          {/* Meta */}
          <header className="mb-12">
            <span className="inline-block font-body text-xs uppercase tracking-widest bg-[#22C55E] text-black px-4 py-1.5 mb-6">
              {article.category}
            </span>
            <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-none tracking-tighter text-white mb-6">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 font-body text-xs text-[#A1A1AA] border-b border-[#1F1F1F] pb-6">
              <span>Par <strong className="text-white">Yann Bazika</strong></span>
              <span>·</span>
              <span>{formatDate(article.publishedAt)}</span>
              <span>·</span>
              <span>{article.readingTime} min de lecture</span>
            </div>
          </header>

          {/* Corps de l'article */}
          <div
            className="prose prose-invert prose-lg max-w-none
              prose-headings:font-display prose-headings:tracking-tight prose-headings:uppercase
              prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4
              prose-p:text-[#FAFAFA] prose-p:leading-relaxed prose-p:font-body
              prose-strong:text-white prose-strong:font-semibold
              prose-a:text-[#22C55E] prose-a:no-underline hover:prose-a:underline
              prose-blockquote:border-l-[#22C55E] prose-blockquote:text-[#A1A1AA]
              prose-ul:text-[#FAFAFA] prose-ol:text-[#FAFAFA]
              prose-li:marker:text-[#22C55E]"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          {/* CTA fin d'article */}
          <div className="mt-20 mb-16 border border-[#22C55E] p-8 md:p-10">
            <p className="font-body uppercase tracking-[0.3em] text-[#22C55E] text-xs mb-3">
              — PASSEZ À L'ACTION
            </p>
            <h2 className="font-display text-3xl md:text-4xl tracking-tight text-white mb-4">
              VOUS VOULEZ APPLIQUER ÇA
              <br />À VOTRE ROUTINE ?
            </h2>
            <p className="font-body text-[#A1A1AA] text-sm mb-8 max-w-md leading-relaxed">
              Réservez une séance découverte gratuite avec Yann. On analyse vos habitudes et on construit un plan personnalisé.
            </p>
            <Link
              href="/reserver"
              className="group inline-flex items-center gap-3 bg-[#22C55E] text-black font-body font-semibold uppercase tracking-widest text-sm px-10 py-5 hover:bg-[#16A34A] transition-colors duration-300"
            >
              RÉSERVER UNE SÉANCE DÉCOUVERTE
              <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
            </Link>
          </div>

          {/* Retour */}
          <div className="pb-24">
            <Link
              href="/journal"
              className="group inline-flex items-center gap-2 font-body text-xs uppercase tracking-widest text-[#A1A1AA] hover:text-white transition-colors"
            >
              <span className="group-hover:-translate-x-1 transition-transform duration-200">←</span>
              RETOUR AU JOURNAL
            </Link>
          </div>
        </article>

        {/* Articles suggérés */}
        {related.length > 0 && (
          <section className="bg-[#0A0A0A] border-t border-[#1F1F1F] py-20 px-6 md:px-12">
            <div className="max-w-5xl mx-auto">
              <p className="font-body uppercase tracking-[0.3em] text-[#22C55E] text-xs mb-8">
                — DANS LA MÊME CATÉGORIE
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {related.map((a) => (
                  <Link key={a.id} href={`/journal/${a.slug}`} className="group block">
                    <div className="relative aspect-[4/3] overflow-hidden mb-4 bg-[#1F1F1F]">
                      <Image
                        src={a.coverImage}
                        alt={a.title}
                        fill
                        className="object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <span className="font-body text-xs uppercase tracking-widest text-[#22C55E] mb-2 block">
                      {a.category}
                    </span>
                    <h3 className="font-display text-xl tracking-tight text-white group-hover:text-[#22C55E] transition-colors duration-300">
                      {a.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
