"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

export function CoachSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"]);

  return (
    <section
      id="coach"
      ref={ref}
      className="relative bg-[#0A0A0A] py-24 md:py-32 overflow-hidden"
      aria-label="Section Le Coach"
    >
      <div className="section-container grid md:grid-cols-2 gap-12 md:gap-20 items-center">
        {/* Colonne image */}
        <motion.div
          className="relative aspect-[3/4] overflow-hidden group"
          initial={{ opacity: 0, x: -60 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Portrait Yann — traitement N&B, retour couleur au hover */}
          <motion.div
            className="relative w-full h-full"
            style={{ y: imageY }}
          >
            <Image
              src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80"
              alt="Yann Bazika — Coach Atlas Fitness dans une salle de sport"
              fill
              className="object-cover object-center transition-all duration-[800ms] ease-in-out
                grayscale contrast-110 brightness-95
                group-hover:grayscale-0 group-hover:brightness-100
                animate-ken-burns"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </motion.div>

          {/* Grain overlay */}
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`,
            }}
            aria-hidden="true"
          />

          {/* Vignette bords */}
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background: "radial-gradient(ellipse at center, transparent 50%, rgba(10,10,10,0.7) 100%)",
            }}
            aria-hidden="true"
          />

          {/* Numéro de section */}
          <div className="absolute bottom-6 left-6 z-20">
            <span className="font-body text-xs uppercase tracking-widest text-[#22C55E]">
              Coach Certifié
            </span>
          </div>
        </motion.div>

        {/* Colonne texte */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Kicker */}
          <p className="font-body uppercase tracking-[0.3em] text-[#22C55E] text-xs mb-6">
            01 — LE COACH
          </p>

          {/* Titre asymétrique */}
          <h2 className="font-display leading-none tracking-tighter mb-8">
            <span className="block text-[clamp(4rem,10vw,9rem)] text-white italic">
              YANN
            </span>
            <span
              className="block text-[clamp(4rem,10vw,9rem)]"
              style={{ WebkitTextStroke: "2px #FAFAFA", color: "transparent" }}
            >
              BAZIKA
            </span>
          </h2>

          {/* Corps de texte */}
          <div className="space-y-4 mb-8">
            <p className="font-body text-[#A1A1AA] leading-relaxed">
              Atlas Fitness est né d'une conviction :{" "}
              <span className="text-white font-semibold">
                le sport ne se limite pas à l'apparence
              </span>
              . C'est un levier pour renforcer le corps, clarifier l'esprit,
              nourrir l'âme.
            </p>
            <p className="font-body text-[#A1A1AA] leading-relaxed">
              Je vous accompagne vers une vie plus saine, plus forte, plus
              épanouissante. Musculation, nutrition, développement mental : une
              méthode holistique, personnalisée, exigeante.
            </p>
          </div>

          {/* Signature manuscrite */}
          <div className="mb-8">
            <span className="font-accent text-3xl text-[#22C55E]">
              Yann Bazika
            </span>
          </div>

          {/* Citation */}
          <blockquote className="border-l-2 border-[#22C55E] pl-6">
            <p className="font-body italic text-white/80 text-lg leading-relaxed">
              "Rejoignez l'aventure. Dépassez vos limites. Construisons la
              meilleure version de vous-même."
            </p>
          </blockquote>
        </motion.div>
      </div>

      {/* Grand texte décoratif en fond */}
      <div
        className="absolute -bottom-8 left-0 right-0 text-center pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <span
          className="font-display text-[clamp(6rem,20vw,16rem)] leading-none tracking-tighter whitespace-nowrap"
          style={{ WebkitTextStroke: "1px rgba(250,250,250,0.04)", color: "transparent" }}
        >
          YANN BAZIKA
        </span>
      </div>
    </section>
  );
}
