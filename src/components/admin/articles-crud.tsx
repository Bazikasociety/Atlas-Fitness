"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Eye, X, Check } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  coverImage: string;
  readingTime: number;
  featured: boolean;
  publishedAt: string;
  views: number;
}

interface ArticleForm {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage: string;
  featured: boolean;
}

const CATEGORIES = ["NUTRITION", "MUSCULATION", "MENTAL", "RECHERCHE"];

const EMPTY_FORM: ArticleForm = {
  title: "",
  excerpt: "",
  content: "",
  category: "NUTRITION",
  coverImage: "",
  featured: false,
};

export function ArticlesCrud() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState<ArticleForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  async function fetchArticles() {
    const res = await fetch("/api/admin/articles");
    const data = await res.json();
    setArticles(data);
    setLoading(false);
  }

  function startEdit(article: Article) {
    setEditingId(article.id);
    setIsCreating(false);
    setForm({
      title: article.title,
      excerpt: article.excerpt,
      content: "",
      category: article.category,
      coverImage: article.coverImage,
      featured: article.featured,
    });
  }

  function startCreate() {
    setIsCreating(true);
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  function cancel() {
    setEditingId(null);
    setIsCreating(false);
    setForm(EMPTY_FORM);
  }

  async function save() {
    setSaving(true);
    try {
      if (isCreating) {
        await fetch("/api/admin/articles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else if (editingId) {
        await fetch("/api/admin/articles", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...form }),
        });
      }
      await fetchArticles();
      cancel();
    } finally {
      setSaving(false);
    }
  }

  async function deleteArticle(id: string) {
    await fetch(`/api/admin/articles?id=${id}`, { method: "DELETE" });
    setArticles((prev) => prev.filter((a) => a.id !== id));
    setDeleteId(null);
  }

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-14 bg-[#1F1F1F] animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Formulaire création/édition */}
      <AnimatePresence>
        {(isCreating || editingId) && (
          <motion.div
            className="border border-[#22C55E] p-6 mb-8"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl tracking-tight text-white">
                {isCreating ? "NOUVEL ARTICLE" : "MODIFIER L'ARTICLE"}
              </h3>
              <button onClick={cancel} className="text-[#A1A1AA] hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block font-body text-xs uppercase tracking-widest text-[#A1A1AA] mb-2">
                  Titre *
                </label>
                <input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full bg-[#1F1F1F] border border-[#1F1F1F] text-white font-body text-sm px-4 py-3 focus:outline-none focus:border-[#22C55E]"
                  placeholder="Titre de l'article"
                />
              </div>
              <div>
                <label className="block font-body text-xs uppercase tracking-widest text-[#A1A1AA] mb-2">
                  Catégorie *
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full bg-[#1F1F1F] border border-[#1F1F1F] text-white font-body text-sm px-4 py-3 focus:outline-none focus:border-[#22C55E]"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block font-body text-xs uppercase tracking-widest text-[#A1A1AA] mb-2">
                Extrait
              </label>
              <input
                value={form.excerpt}
                onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                className="w-full bg-[#1F1F1F] border border-[#1F1F1F] text-white font-body text-sm px-4 py-3 focus:outline-none focus:border-[#22C55E]"
                placeholder="Résumé en 1-2 phrases"
              />
            </div>
            {isCreating && (
              <div className="mb-4">
                <label className="block font-body text-xs uppercase tracking-widest text-[#A1A1AA] mb-2">
                  Contenu (Markdown) *
                </label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  rows={10}
                  className="w-full bg-[#1F1F1F] border border-[#1F1F1F] text-white font-body text-sm px-4 py-3 focus:outline-none focus:border-[#22C55E] resize-y font-mono"
                  placeholder="# Titre\n\nContenu en **markdown**..."
                />
              </div>
            )}
            <div className="mb-4">
              <label className="block font-body text-xs uppercase tracking-widest text-[#A1A1AA] mb-2">
                Image de couverture (URL Unsplash)
              </label>
              <input
                value={form.coverImage}
                onChange={(e) => setForm((f) => ({ ...f, coverImage: e.target.value }))}
                className="w-full bg-[#1F1F1F] border border-[#1F1F1F] text-white font-body text-sm px-4 py-3 focus:outline-none focus:border-[#22C55E]"
                placeholder="https://images.unsplash.com/..."
              />
            </div>
            <div className="flex items-center gap-4 mb-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, featured: !f.featured }))}
                  className={`w-5 h-5 border flex items-center justify-center transition-colors ${
                    form.featured ? "bg-[#22C55E] border-[#22C55E]" : "border-[#A1A1AA]"
                  }`}
                  aria-pressed={form.featured}
                >
                  {form.featured && <Check size={12} className="text-black" />}
                </button>
                <span className="font-body text-sm text-[#A1A1AA]">Mettre en avant</span>
              </label>
            </div>
            <button
              onClick={save}
              disabled={saving || !form.title || (isCreating && !form.content)}
              className="bg-[#22C55E] text-black font-body font-semibold uppercase tracking-widest text-xs px-8 py-3.5 hover:bg-[#16A34A] transition-colors disabled:opacity-60"
            >
              {saving ? "SAUVEGARDE..." : isCreating ? "CRÉER L'ARTICLE" : "SAUVEGARDER"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bouton créer */}
      {!isCreating && !editingId && (
        <button
          onClick={startCreate}
          className="group flex items-center gap-3 border border-[#1F1F1F] font-body text-xs uppercase tracking-widest text-[#A1A1AA] px-6 py-3.5 hover:border-[#22C55E] hover:text-[#22C55E] transition-colors mb-8"
        >
          <Plus size={14} />
          NOUVEL ARTICLE
        </button>
      )}

      {/* Liste articles */}
      <div className="divide-y divide-[#1F1F1F]">
        {articles.map((article) => (
          <div
            key={article.id}
            className="flex items-center gap-4 py-4 group"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <span className="font-body text-xs uppercase tracking-wider text-[#22C55E]">
                  {article.category}
                </span>
                {article.featured && (
                  <span className="font-body text-xs text-[#A1A1AA]">· En avant</span>
                )}
              </div>
              <p className="font-body text-sm text-white truncate">{article.title}</p>
              <div className="flex items-center gap-3 mt-1 font-body text-xs text-[#A1A1AA]">
                <span>{formatDate(article.publishedAt)}</span>
                <span>·</span>
                <span>{article.readingTime} min</span>
                <span>·</span>
                <span>{article.views} vues</span>
              </div>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <a
                href={`/journal/${article.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-[#A1A1AA] hover:text-white transition-colors"
                aria-label="Voir"
              >
                <Eye size={16} />
              </a>
              <button
                onClick={() => startEdit(article)}
                className="p-2 text-[#A1A1AA] hover:text-[#22C55E] transition-colors"
                aria-label="Modifier"
              >
                <Pencil size={16} />
              </button>
              {deleteId === article.id ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => deleteArticle(article.id)}
                    className="p-2 text-red-400 hover:text-red-300 transition-colors"
                    aria-label="Confirmer suppression"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteId(null)}
                    className="p-2 text-[#A1A1AA] hover:text-white transition-colors"
                    aria-label="Annuler"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setDeleteId(article.id)}
                  className="p-2 text-[#A1A1AA] hover:text-red-400 transition-colors"
                  aria-label="Supprimer"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
