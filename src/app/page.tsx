// Rendu dynamique — la page est générée à chaque requête (données DB fraîches)
export const dynamic = "force-dynamic";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/sections/hero";
import { StatsBand } from "@/components/sections/stats-band";
import { CoachSection } from "@/components/sections/coach-section";
import { MethodeSection } from "@/components/sections/methode-section";
import { QuizCtaSection } from "@/components/sections/quiz-cta-section";
import { ForfaitSection } from "@/components/sections/forfait-section";
import { JournalPreview } from "@/components/sections/journal-preview";
import { ContactSection } from "@/components/sections/contact-section";
import { prisma } from "@/lib/prisma";

// Schema LocalBusiness pour le SEO
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Atlas Fitness",
  description: "Coaching sportif personnalisé. Musculation, nutrition, développement mental.",
  url: process.env.NEXT_PUBLIC_SITE_URL,
  email: "societebazika@gmail.com",
  priceRange: "€€",
  openingHours: "Mo-Su 07:00-21:00",
};

export default async function HomePage() {
  // Récupération des 3 derniers articles pour la preview (fallback vide si DB inaccessible)
  let articles: {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    coverImage: string | null;
    readingTime: number;
    publishedAt: Date;
  }[] = [];
  try {
    articles = await prisma.article.findMany({
      take: 3,
      orderBy: { publishedAt: "desc" },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        category: true,
        coverImage: true,
        readingTime: true,
        publishedAt: true,
      },
    });
  } catch (err) {
    console.error("[HomePage] DB error:", err);
  }

  return (
    <>
      {/* Schema SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      <Navbar />
      <main>
        <HeroSection />
        <StatsBand />
        <CoachSection />
        <MethodeSection />
        <QuizCtaSection />
        <ForfaitSection />
        <JournalPreview articles={articles} />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
