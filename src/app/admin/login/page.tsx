"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const json = await res.json();
      setError(json.error ?? "Erreur d'authentification");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="mb-12">
          <p className="font-body uppercase tracking-[0.3em] text-[#22C55E] text-xs mb-4">
            — ADMINISTRATION
          </p>
          <h1 className="font-display text-5xl md:text-6xl leading-none tracking-tighter text-white">
            ATLAS FITNESS
          </h1>
          <p className="font-body text-[#A1A1AA] text-sm mt-2">Dashboard privé</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <label className="block font-body text-xs uppercase tracking-widest text-[#A1A1AA] mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full bg-[#1F1F1F] border border-[#1F1F1F] text-white font-body text-sm px-5 py-4 pr-12 focus:outline-none focus:border-[#22C55E] transition-colors"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A1A1AA] hover:text-white transition-colors"
                aria-label={showPass ? "Masquer" : "Afficher"}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="font-body text-xs text-red-400 border border-red-500/30 px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-[#22C55E] text-black font-body font-semibold uppercase tracking-widest text-sm py-5 hover:bg-[#16A34A] transition-colors duration-300 disabled:opacity-60"
          >
            {loading ? "CONNEXION..." : "ACCÉDER →"}
          </button>
        </form>
      </motion.div>
    </main>
  );
}
