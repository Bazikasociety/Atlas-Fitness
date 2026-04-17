"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { QUIZ_QUESTIONS, interpretScore, getPersonalizedAdvice } from "@/lib/quiz-data";

interface QuizResultProps {
  totalScore: number;
  answers: Record<string, number>;
  onRestart: () => void;
}

// Jauge radiale SVG — arc qui se dessine progressivement
function RadialGauge({ score, color }: { score: number; color: string }) {
  const radius = 120;
  const stroke = 8;
  const normalizedRadius = radius - stroke;
  const circumference = normalizedRadius * 2 * Math.PI;
  // Arc partiel (270° d'arc total, pas un cercle complet — style tachymètre)
  const arcLength = circumference * 0.75;
  const fillLength = arcLength * (score / 20);
  const gap = circumference * 0.25;

  return (
    <div className="relative flex items-center justify-center" style={{ width: radius * 2, height: radius * 2 }}>
      <svg
        width={radius * 2}
        height={radius * 2}
        viewBox={`0 0 ${radius * 2} ${radius * 2}`}
        aria-hidden="true"
        style={{ transform: "rotate(135deg)" }}
      >
        {/* Track (fond gris) */}
        <circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="none"
          stroke="#1F1F1F"
          strokeWidth={stroke}
          strokeDasharray={`${arcLength} ${gap}`}
          strokeLinecap="round"
        />
        {/* Arc coloré animé */}
        <motion.circle
          cx={radius}
          cy={radius}
          r={normalizedRadius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${circumference}`}
          initial={{ strokeDashoffset: arcLength }}
          animate={{ strokeDashoffset: arcLength - fillLength }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        />
      </svg>
      {/* Score au centre */}
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ transform: "rotate(0deg)" }}>
        <motion.span
          className="font-display leading-none tracking-tighter"
          style={{ fontSize: "3.5rem", color }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          {score.toFixed(1)}
        </motion.span>
        <motion.span
          className="font-body text-xs uppercase tracking-widest text-[#A1A1AA]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          / 20
        </motion.span>
      </div>
    </div>
  );
}

// Barre de progression par catégorie
function CategoryBar({
  label,
  score,
  maxScore,
  index,
  color,
}: {
  label: string;
  score: number;
  maxScore: number;
  index: number;
  color: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const pct = (score / maxScore) * 100;

  return (
    <motion.div
      ref={ref}
      className="flex items-center gap-4"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="font-body text-xs uppercase tracking-wider text-[#A1A1AA] w-36 shrink-0">
        {label}
      </span>
      <div className="flex-1 h-1 bg-[#1F1F1F] overflow-hidden">
        <motion.div
          className="h-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${pct}%` } : {}}
          transition={{ duration: 1, delay: 0.2 + index * 0.06, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <span className="font-display text-sm w-8 text-right" style={{ color }}>
        {score.toFixed(1)}
      </span>
    </motion.div>
  );
}

export function QuizResult({ totalScore, answers, onRestart }: QuizResultProps) {
  const interpretation = interpretScore(totalScore);
  const advice = getPersonalizedAdvice(answers);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setEmailLoading(true);
    try {
      await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, totalScore, email }),
      });
      setEmailSent(true);
    } catch {
      // Silencieux
    } finally {
      setEmailLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-24 px-6">
      <div className="max-w-3xl mx-auto">

        {/* Label interprétation */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="font-body uppercase tracking-[0.3em] text-[#22C55E] text-xs mb-4">
            — RÉSULTAT
          </p>
          <h1
            className="font-display text-[clamp(3rem,10vw,8rem)] leading-none tracking-tighter"
            style={{ color: interpretation.color }}
          >
            {interpretation.label}
          </h1>
          <p className="font-body text-[#A1A1AA] text-lg mt-4 max-w-xl leading-relaxed">
            {interpretation.description}
          </p>
        </motion.div>

        {/* Jauge + score */}
        <motion.div
          className="flex flex-col sm:flex-row items-center gap-12 mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <RadialGauge score={totalScore} color={interpretation.color} />

          <div className="flex-1">
            <p className="font-body text-xs uppercase tracking-widest text-[#A1A1AA] mb-2">
              Votre note de santé
            </p>
            <div className="font-display text-[clamp(4rem,12vw,9rem)] leading-none tracking-tighter text-white">
              {totalScore.toFixed(1)}
              <span
                className="text-[40%] ml-2"
                style={{ color: interpretation.color }}
              >
                /20
              </span>
            </div>
            <p className="font-body text-sm text-[#A1A1AA] mt-4">
              Basé sur les recommandations OMS & données INSEE
            </p>
          </div>
        </motion.div>

        {/* Détail par catégorie */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          <h2 className="font-display text-2xl md:text-3xl tracking-tight text-white mb-8">
            DÉTAIL PAR CATÉGORIE
          </h2>
          <div className="space-y-5">
            {QUIZ_QUESTIONS.map((q, i) => (
              <CategoryBar
                key={q.id}
                label={q.category}
                score={answers[q.id] ?? 0}
                maxScore={2.5}
                index={i}
                color={interpretation.color}
              />
            ))}
          </div>
        </motion.div>

        {/* Conseils personnalisés */}
        {advice.length > 0 && (
          <motion.div
            className="mb-20 border border-[#1F1F1F] p-8 md:p-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
          >
            <p className="font-body uppercase tracking-[0.3em] text-[#22C55E] text-xs mb-6">
              — VOS 3 PRIORITÉS
            </p>
            <div className="space-y-6">
              {advice.map((tip, i) => (
                <motion.div
                  key={i}
                  className="flex gap-5 items-start"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + i * 0.1, duration: 0.5 }}
                >
                  <span
                    className="font-display text-3xl leading-none shrink-0 mt-1"
                    style={{ color: interpretation.color }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="font-body text-[#FAFAFA] leading-relaxed">{tip}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Capture email */}
        <motion.div
          className="mb-16 border border-[#1F1F1F] p-8 md:p-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
        >
          <h3 className="font-display text-xl md:text-2xl tracking-tight text-white mb-2">
            RECEVEZ VOS RÉSULTATS
          </h3>
          <p className="font-body text-sm text-[#A1A1AA] mb-6">
            Recevez un plan d'action personnalisé par email — gratuit, sans engagement.
          </p>
          {emailSent ? (
            <motion.p
              className="font-body text-[#22C55E] text-sm uppercase tracking-widest"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              ✓ Envoyé — consultez votre boîte mail.
            </motion.p>
          ) : (
            <form onSubmit={handleEmailSubmit} className="flex gap-3 flex-col sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                aria-label="Adresse email"
                className="flex-1 bg-[#1F1F1F] border border-[#1F1F1F] text-white placeholder-[#A1A1AA] font-body text-sm px-5 py-4 focus:outline-none focus:border-[#22C55E] transition-colors"
              />
              <button
                type="submit"
                disabled={emailLoading}
                className="bg-white text-black font-body font-semibold uppercase tracking-widest text-xs px-8 py-4 hover:bg-[#22C55E] transition-colors duration-300 disabled:opacity-50"
              >
                {emailLoading ? "..." : "ENVOYER →"}
              </button>
            </form>
          )}
        </motion.div>

        {/* CTA principal */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.7 }}
        >
          <Link
            href="/reserver"
            className="group flex-1 flex items-center justify-center gap-3 bg-[#22C55E] text-black font-body font-semibold uppercase tracking-widest text-sm py-6 hover:bg-[#16A34A] transition-colors duration-300"
          >
            RÉSERVER UNE SÉANCE DÉCOUVERTE
            <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
          </Link>
          <button
            onClick={onRestart}
            className="px-8 py-6 border border-[#1F1F1F] font-body text-xs uppercase tracking-widest text-[#A1A1AA] hover:border-white hover:text-white transition-colors duration-300"
          >
            RECOMMENCER
          </button>
        </motion.div>

      </div>
    </div>
  );
}
