"use client";

import { motion } from "framer-motion";

interface QuizLandingProps {
  onStart: () => void;
}

export function QuizLanding({ onStart }: QuizLandingProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center">
      {/* Pulsation animée */}
      <motion.div
        className="relative mb-12"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <svg viewBox="0 0 100 100" className="w-24 h-24" aria-hidden="true">
          <motion.circle
            cx="50" cy="50" r="40"
            fill="none" stroke="#22C55E" strokeWidth="1"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
          <circle cx="50" cy="50" r="28" fill="none" stroke="#22C55E" strokeWidth="1.5" opacity="0.4" />
          <polyline
            points="10,50 22,50 30,30 38,70 46,50 54,50 60,38 66,62 72,50 90,50"
            fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>
      </motion.div>

      {/* Titre */}
      <motion.h1
        className="font-display leading-none tracking-tighter mb-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <span className="block text-[clamp(2.5rem,8vw,7rem)] text-white">ÉVALUEZ</span>
        <span className="block text-[clamp(2.5rem,8vw,7rem)] text-white">VOTRE</span>
        <span className="block text-[clamp(2.5rem,8vw,7rem)] text-[#22C55E]">SANTÉ</span>
      </motion.h1>

      {/* Description */}
      <motion.p
        className="font-body text-[#A1A1AA] max-w-md text-base leading-relaxed mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        8 questions basées sur les recommandations de l'OMS et les données de
        l'INSEE pour évaluer vos habitudes de vie.
      </motion.p>

      {/* Pastilles */}
      <motion.div
        className="flex flex-wrap justify-center gap-3 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.55 }}
      >
        {["8 QUESTIONS", "RÉSULTAT IMMÉDIAT", "CONSEILS PERSONNALISÉS"].map((tag) => (
          <span
            key={tag}
            className="font-body text-xs uppercase tracking-widest border border-[#1F1F1F] text-[#A1A1AA] px-4 py-2"
          >
            {tag}
          </span>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.button
        onClick={onStart}
        className="group inline-flex items-center gap-3 bg-[#22C55E] text-black font-body font-semibold uppercase tracking-widest text-sm px-10 py-5 hover:bg-[#16A34A] transition-colors duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
      >
        COMMENCER LE QUIZ
        <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
      </motion.button>
    </div>
  );
}
