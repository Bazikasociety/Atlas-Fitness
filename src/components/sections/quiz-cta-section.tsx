"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";

function HeartbeatSVG() {
  return (
    <svg
      viewBox="0 0 200 80"
      className="w-full max-w-xs"
      aria-hidden="true"
      fill="none"
    >
      <motion.polyline
        points="0,40 30,40 45,10 55,70 65,40 80,40 90,20 100,40 115,40 125,55 135,25 145,40 200,40"
        stroke="#22C55E"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 }}
      />
    </svg>
  );
}

export function QuizCtaSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="quiz"
      ref={ref}
      className="bg-[#FAFAFA] py-24 md:py-40 overflow-hidden"
      aria-label="Quiz Santé — CTA"
    >
      <div className="section-container grid md:grid-cols-2 gap-12 md:gap-20 items-center">
        {/* Icône pulsation */}
        <motion.div
          className="flex justify-center md:justify-end"
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.9 }}
        >
          <div className="relative">
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-full border-2 border-[#22C55E]/30 flex items-center justify-center">
              <div className="w-32 h-32 md:w-44 md:h-44 rounded-full border-2 border-[#22C55E]/50 flex items-center justify-center">
                <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border-2 border-[#22C55E] flex items-center justify-center bg-[#22C55E]/10">
                  <HeartbeatSVG />
                </div>
              </div>
            </div>
            {/* Pulse animation */}
            <motion.div
              className="absolute inset-0 rounded-full border border-[#22C55E]/20"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </div>
        </motion.div>

        {/* Texte */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.15 }}
        >
          <p className="font-body uppercase tracking-[0.3em] text-[#22C55E] text-xs mb-6">
            03 — QUIZ SANTÉ
          </p>

          {/* Titre — noir sur blanc, déborde */}
          <h2 className="font-display leading-none tracking-tighter text-[#0A0A0A] mb-6 -mr-4 md:-mr-20">
            <span className="block text-[clamp(3rem,9vw,8rem)]">
              VOUS PENSEZ
            </span>
            <span className="block text-[clamp(3rem,9vw,8rem)] whitespace-nowrap">
              ÊTRE EN FORME ?
            </span>
          </h2>

          <p className="font-body text-[#0A0A0A]/60 mb-8 text-base leading-relaxed max-w-sm">
            8 questions. OMS & INSEE. Une note brutale{" "}
            <span className="font-semibold text-[#0A0A0A]">sur 20</span>.
            Pas de filtre.
          </p>

          {/* Pastilles */}
          <div className="flex flex-wrap gap-3 mb-10">
            {["8 QUESTIONS", "RÉSULTAT IMMÉDIAT", "CONSEILS PERSONNALISÉS"].map(
              (tag) => (
                <span
                  key={tag}
                  className="font-body text-xs uppercase tracking-widest border border-[#0A0A0A]/30 text-[#0A0A0A] px-4 py-2"
                >
                  {tag}
                </span>
              )
            )}
          </div>

          <Link
            href="/quiz"
            className="group inline-flex items-center gap-3 bg-[#0A0A0A] text-white font-body font-semibold uppercase tracking-widest text-sm px-10 py-5 hover:bg-[#22C55E] hover:text-black transition-all duration-300"
          >
            COMMENCER LE TEST
            <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
