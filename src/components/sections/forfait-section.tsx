"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Check } from "lucide-react";

const FEATURES = [
  "2 à 3 séances en présentiel par mois",
  "Plan stratégique sur mesure ajustable + suivi des stats",
  "Suivi illimité par message / email",
  "Accompagnement et apprentissage nutritionnel",
  "Suivi détaillé alimentaire",
  "Soutien mental",
];

const TICKER_ITEMS = [
  "POPULAIRE",
  "LE CHOIX N°1",
  "TRANSFORMEZ VOTRE CORPS",
  "RÉSULTATS GARANTIS",
  "MÉTHODE ÉPROUVÉE",
];

export function ForfaitSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const tickerText = [...TICKER_ITEMS, ...TICKER_ITEMS]
    .map((item) => `${item} ·`)
    .join("  ");

  return (
    <section
      id="forfait"
      ref={ref}
      className="bg-[#0A0A0A] py-24 md:py-32 overflow-hidden"
      aria-label="Forfait Remise en Forme"
    >
      {/* Ticker au-dessus */}
      <div className="ticker-wrap border-y border-[#1F1F1F] py-3 mb-16" aria-hidden="true">
        <div className="ticker-content-slow font-display text-sm tracking-widest text-[#22C55E] whitespace-nowrap">
          {tickerText}&nbsp;&nbsp;&nbsp;{tickerText}
        </div>
      </div>

      <div className="section-container">
        {/* Header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="font-body uppercase tracking-[0.3em] text-[#22C55E] text-xs mb-4">
            04 — FORFAIT
          </p>
          <h2 className="font-display text-[clamp(3rem,8vw,7rem)] leading-none tracking-tighter text-white">
            UNE OFFRE.
            <br />
            <span style={{ WebkitTextStroke: "2px #FAFAFA", color: "transparent" }}>
              TOUT INCLUS.
            </span>
          </h2>
        </motion.div>

        {/* Carte forfait */}
        <motion.div
          className="max-w-2xl mx-auto border-2 border-[#22C55E] bg-[#0A0A0A] relative overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.15 }}
        >
          {/* Effet glow vert en fond */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at 50% 0%, rgba(34,197,94,0.08) 0%, transparent 70%)",
            }}
            aria-hidden="true"
          />

          <div className="relative z-10 p-8 md:p-12">
            {/* Tag */}
            <div className="flex items-center gap-3 mb-8">
              <span className="font-body text-xs uppercase tracking-widest text-[#0A0A0A] bg-[#22C55E] px-4 py-1.5">
                REMISE EN FORME
              </span>
              <span className="font-body text-xs uppercase tracking-widest text-[#A1A1AA]">
                FORFAIT COMPLET · 1 MOIS
              </span>
            </div>

            {/* Prix */}
            <div className="flex items-end gap-3 mb-10">
              <span className="font-display text-[8rem] md:text-[10rem] leading-none tracking-tighter text-white">
                150
              </span>
              <div className="mb-4">
                <span className="font-display text-4xl text-[#22C55E]">€</span>
                <p className="font-body text-xs uppercase tracking-widest text-[#A1A1AA]">
                  /mois
                </p>
              </div>
            </div>

            {/* Features */}
            <ul className="space-y-4 mb-10">
              {FEATURES.map((feature, i) => (
                <motion.li
                  key={feature}
                  className="flex items-center gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
                >
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#22C55E]/20 border border-[#22C55E] flex items-center justify-center">
                    <Check size={12} className="text-[#22C55E]" strokeWidth={3} />
                  </span>
                  <span className="font-body text-sm text-[#FAFAFA]">{feature}</span>
                </motion.li>
              ))}
            </ul>

            {/* CTA */}
            <Link
              href="/reserver"
              className="group flex items-center justify-center gap-3 w-full bg-[#22C55E] text-black font-body font-semibold uppercase tracking-widest text-sm py-5 hover:bg-[#16A34A] transition-colors duration-300"
            >
              REJOINDRE ATLAS FITNESS
              <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
            </Link>

            {/* Note */}
            <p className="font-body text-xs text-[#A1A1AA] text-center mt-4">
              Sans engagement · Paiement sécurisé par Stripe
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
