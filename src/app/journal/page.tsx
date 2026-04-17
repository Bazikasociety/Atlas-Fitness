import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { JournalGrid } from "@/components/journal/journal-grid";
import { formatDate } from "@/lib/utils";

// Rendu dynamique — évite la connexion DB au moment du build
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Le Journal — Atlas Fitness",
  description:
    "Articles sur la musculation, la nutrition, le mental et la recherche. Le savoir au service de votre performance.",
};

export const revalidate = 3600; // ISR — revalide toutes les heures

export default async function JournalPage() {
  let articles: Awaited<ReturnType<typeof prisma.article.findMany>> = [];
  try {
    articles = await prisma.article.findMany({
      orderBy: { publishedAt: "desc" },
    });
  } catch (err) {
    console.error("[JournalPage] DB error:", err);
  }

  const featured = articles.find((a) => a.featured) ?? articles[0];
  const rest = articles.filter((a) => a.id !== featured?.id);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0A0A0A]">

        {/* Bandeau ticker */}
        <div className="bg-[#22C55E] py-2 overflow-hidden" aria-hidden="true">
          <div className="ticker-content font-body text-xs uppercase tracking-widest text-black whitespace-nowrap">
            {Array(6).fill("📰 LE JOURNAL ATLAS · MIS À JOUR RÉGULIÈREMENT · ").join("")}
          </div>
        </div>

        {/* Hero article featured */}
        {featured && (
          <section className="relative h-[70vh] min-h-[500px] overflow-hidden" aria-label="Article mis en avant">
            <Image
              src={featured.coverImage}
              alt={featured.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16">
              <div className="max-w-3xl">
                <span className="inline-block font-body text-xs uppercase tracking-widest bg-[#22C55E] text-black px-4 py-1.5 mb-4">
                  {featured.category}
                </span>
                <h1 className="font-display text-[clamp(2.5rem,6vw,5.5rem)] leading-none tracking-tighter text-white mb-4">
                  {featured.title}
                </h1>
                <p className="font-body text-[#A1A1AA] text-sm mb-6 max-w-xl leading-relaxed">
                  {featured.excerpt}
                </p>
                <div className="flex items-center gap-4 mb-6">
                  <span className="font-body text-xs text-[#A1A1AA]">
                    {formatDate(featured.publishedAt)}
                  </span>
                  <span className="text-[#1F1F1F]">·</span>
                  <span className="font-body text-xs text-[#A1A1AA]">
                    {featured.readingTime} min de lecture
                  </span>
                </div>
                <Link
                  href={`/journal/${featured.slug}`}
                  className="group inline-flex items-center gap-3 bg-white text-black font-body font-semibold uppercase tracking-widest text-xs px-8 py-4 hover:bg-[#22C55E] transition-colors duration-300"
                >
                  LIRE L'ARTICLE
                  <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Header section */}
        <div className="section-container pt-20 pb-10">
          <div className="flex items-end justify-between">
            <div>
              <p className="font-body uppercase tracking-[0.3em] text-[#22C55E] text-xs mb-3">
                05 — LE JOURNAL
              </p>
              <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-none tracking-tighter text-white">
                TOUS LES
                <br />
                <span className="text-outline-2 text-white">ARTICLES</span>
              </h2>
            </div>
            <p className="hidden md:block font-body text-xs text-[#A1A1AA] uppercase tracking-wider">
              {articles.length} articles
            </p>
          </div>
        </div>

        {/* Grille avec filtres (composant client) */}
        <div className="section-container pb-32">
          <JournalGrid articles={rest} />
        </div>
      </main>
      <Footer />
    </>
  );
}
