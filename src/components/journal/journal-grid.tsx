"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { formatDate } from "@/lib/utils";

const CATEGORIES = ["TOUT", "NUTRITION", "MUSCULATION", "MENTAL", "RECHERCHE"] as const;

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

interface JournalGridProps {
  articles: Article[];
}

export function JournalGrid({ articles }: JournalGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>("TOUT");

  const filtered =
    activeCategory === "TOUT"
      ? articles
      : articles.filter((a) => a.category.toUpperCase() === activeCategory);

  return (
    <div>
      {/* Filtres catégories */}
      <div
        className="flex flex-wrap gap-2 mb-12"
        role="tablist"
        aria-label="Filtrer par catégorie"
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            role="tab"
            aria-selected={activeCategory === cat}
            onClick={() => setActiveCategory(cat)}
            className={`font-body text-xs uppercase tracking-widest px-5 py-2.5 border transition-all duration-200 ${
              activeCategory === cat
                ? "bg-[#22C55E] text-black border-[#22C55E]"
                : "bg-transparent text-[#A1A1AA] border-[#1F1F1F] hover:border-white hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grille d'articles */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {filtered.length === 0 && (
            <p className="font-body text-[#A1A1AA] text-sm col-span-3 py-16 text-center">
              Aucun article dans cette catégorie.
            </p>
          )}
          {filtered.map((article, i) => (
            <ArticleCard key={article.id} article={article} index={i} />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function ArticleCard({ article, index }: { article: Article; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/journal/${article.slug}`} className="group block">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden mb-5 bg-[#1F1F1F]">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Overlay au hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
          {/* Catégorie */}
          <span className="absolute top-4 left-4 font-body text-xs uppercase tracking-widest bg-[#22C55E] text-black px-3 py-1">
            {article.category}
          </span>
        </div>

        {/* Contenu */}
        <h3 className="font-display text-2xl md:text-3xl leading-tight tracking-tight text-white mb-3 group-hover:text-[#22C55E] transition-colors duration-300">
          {article.title}
        </h3>
        <p className="font-body text-[#A1A1AA] text-sm leading-relaxed mb-4 line-clamp-2">
          {article.excerpt}
        </p>
        <div className="flex items-center gap-3 font-body text-xs text-[#A1A1AA]/60">
          <span>{formatDate(article.publishedAt)}</span>
          <span>·</span>
          <span>{article.readingTime} min</span>
          <span className="ml-auto text-[#22C55E] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            LIRE →
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
