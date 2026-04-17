"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";

const TICKER_ITEMS = [
  "MUSCULATION",
  "NUTRITION",
  "MINDSET",
  "DISCIPLINE",
  "RÉSULTATS",
  "NO LIMITS",
  "SHOW UP",
  "EVERY DAMN DAY",
  "PUSH HARDER",
  "YOUR BODY YOUR RULES",
];

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.8], [0.6, 0.95]);

  const tickerText = [...TICKER_ITEMS, ...TICKER_ITEMS]
    .map((item) => `${item} ·`)
    .join("  ");

  return (
    <section
      ref={containerRef}
      className="relative h-screen min-h-[700px] flex flex-col overflow-hidden"
      aria-label="Héro Atlas Fitness"
    >
      {/* Vidéo/image de fond */}
      <div className="absolute inset-0 z-0">
        <video
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="/hero-fallback.jpg"
          aria-hidden="true"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>

        {/* Overlay dégradé */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/80 via-[#0A0A0A]/40 to-[#0A0A0A]"
          style={{ opacity: overlayOpacity }}
        />

        {/* Grain overlay */}
        <div className="absolute inset-0 noise-overlay" aria-hidden="true" />
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 flex-1 flex flex-col justify-center section-container pt-20">
        {/* Titre gigantesque */}
        <motion.div style={{ y: titleY }} className="overflow-hidden">
          <motion.h1
            className="font-display leading-none tracking-tighter"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
              hidden: {},
            }}
          >
            {/* Ligne 1 */}
            <TitleLine delay={0.4}>
              <span className="text-[clamp(4rem,12vw,11rem)] text-white block">
                DÉPASSEZ
              </span>
            </TitleLine>

            {/* Ligne 2 — mot clé en vert */}
            <TitleLine delay={0.55}>
              <span className="text-[clamp(4rem,12vw,11rem)] text-white block">
                VOS{" "}
                <span className="text-[#22C55E] italic">LIMITES</span>
              </span>
            </TitleLine>

            {/* Ligne 3 — outline/fantôme */}
            <TitleLine delay={0.7}>
              <span
                className="text-[clamp(4rem,12vw,11rem)] text-outline block whitespace-nowrap"
                style={{ WebkitTextStroke: "1px rgba(250,250,250,0.3)", color: "transparent" }}
              >
                SURMONTEZ
              </span>
            </TitleLine>

            {/* Ligne 4 */}
            <TitleLine delay={0.85}>
              <span className="text-[clamp(3.2rem,10vw,9.5rem)] text-white block">
                LES OBSTACLES
              </span>
            </TitleLine>
          </motion.h1>
        </motion.div>

        {/* Sous-titre */}
        <motion.p
          className="font-body text-[#A1A1AA] text-sm md:text-base mt-6 max-w-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          Musculation. Nutrition. Mental.{" "}
          <span className="text-white">Une méthode. Zéro excuse.</span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.25 }}
        >
          <Link
            href="/reserver"
            className="group inline-flex items-center gap-3 bg-white text-black font-body font-semibold uppercase tracking-widest text-sm px-8 py-4 hover:bg-[#22C55E] transition-colors duration-300"
          >
            DÉMARRER
            <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
          </Link>
          <Link
            href="#forfait"
            className="group inline-flex items-center gap-3 border-2 border-white/60 text-white font-body font-semibold uppercase tracking-widest text-sm px-8 py-4 hover:border-white hover:bg-white/10 transition-all duration-300"
          >
            VOIR LE FORFAIT
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="relative z-10 flex justify-center pb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-[#A1A1AA]"
          aria-hidden="true"
        >
          <ChevronDown size={24} />
        </motion.div>
      </motion.div>

      {/* Ticker horizontal */}
      <div
        className="relative z-10 border-t border-[#1F1F1F] bg-[#0A0A0A]/80 py-3 overflow-hidden"
        aria-hidden="true"
      >
        <div className="ticker-wrap">
          <div className="ticker-content font-display text-sm md:text-base tracking-widest text-[#A1A1AA] whitespace-nowrap">
            {tickerText}&nbsp;&nbsp;&nbsp;{tickerText}
          </div>
        </div>
      </div>
    </section>
  );
}

function TitleLine({
  children,
  delay,
}: {
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <motion.div
      className="overflow-hidden"
      variants={{
        hidden: {},
        visible: {},
      }}
    >
      <motion.div
        initial={{ y: "110%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
