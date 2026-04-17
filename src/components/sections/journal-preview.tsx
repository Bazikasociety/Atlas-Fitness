"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { formatDate } from "@/lib/utils";

interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  coverImage: string;
  readingTime: number;
  publishedAt: Date | string;
}

interface JournalPreviewProps {
  articles: Article[];
}

export function JournalPreview({ articles }: JournalPreviewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="journal"
      ref={ref}
      className="bg-[#0A0A0A] py-24 md:py-32 border-t border-[#1F1F1F]"
      aria-label="Le Journal"
    >
      <div className="section-container">
        {/* Header */}
        <motion.div
          className="flex items-end justify-between mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div>
            <p className="font-body uppercase tracking-[0.3em] text-[#22C55E] text-xs mb-4">
              05 — LE JOURNAL
            </p>
            <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-none tracking-tighter text-white">
              SAVOIR,
              <br />
              <span style={{ WebkitTextStroke: "2px #FAFAFA", color: "transparent" }}>
                C'EST POUVOIR.
              </span>
            </h2>
          </div>
          <Link
            href="/journal"
            className="hidden md:inline-flex items-center gap-2 font-body text-xs uppercase tracking-widest text-[#A1A1AA] hover:text-[#22C55E] transition-colors group"
          >
            VOIR TOUT LE JOURNAL
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </motion.div>

        {/* Grille articles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {articles.slice(0, 3).map((article, i) => (
            <ArticleCard key={article.id} article={article} index={i} inView={inView} />
          ))}
        </div>

        {/* CTA mobile */}
        <div className="mt-10 flex justify-center md:hidden">
          <Link
            href="/journal"
            className="inline-flex items-center gap-2 font-body text-xs uppercase tracking-widest text-[#A1A1AA] hover:text-[#22C55E] transition-colors group"
          >
            VOIR TOUT LE JOURNAL
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function ArticleCard({
  article,
  index,
  inView,
}: {
  article: Article;
  index: number;
  inView: boolean;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/journal/${article.slug}`} className="group block">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden mb-4 bg-[#1F1F1F]">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out grayscale-[30%] group-hover:grayscale-0"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          {/* Catégorie pill */}
          <span className="absolute top-4 left-4 font-body text-xs uppercase tracking-widest bg-[#22C55E] text-black px-3 py-1">
            {article.category}
          </span>
        </div>

        {/* Contenu */}
        <div>
          <h3 className="font-display text-2xl md:text-3xl leading-tight tracking-tight text-white mb-2 group-hover:text-[#22C55E] transition-colors duration-300">
            {article.title}
          </h3>
          <p className="font-body text-[#A1A1AA] text-sm leading-relaxed mb-3 line-clamp-2">
            {article.excerpt}
          </p>
          <div className="flex items-center gap-3 font-body text-xs text-[#A1A1AA]/60">
            <span>{formatDate(article.publishedAt)}</span>
            <span>·</span>
            <span>{article.readingTime} min de lecture</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
