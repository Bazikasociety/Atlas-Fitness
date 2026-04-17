"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Dumbbell, Apple, Brain, Heart } from "lucide-react";

const PILLARS = [
  {
    number: "01",
    title: "MUSCULATION",
    icon: Dumbbell,
    short: "Programmes adaptés, progression mesurable.",
    full: "Chaque séance est construite autour de vos objectifs réels — force, hypertrophie, endurance musculaire. On mesure, on ajuste, on progresse. Pas de programme générique copié-collé.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80",
  },
  {
    number: "02",
    title: "NUTRITION",
    icon: Apple,
    short: "Plans sur mesure, apprentissage durable.",
    full: "On ne vous donne pas un régime à suivre à la lettre. On vous apprend à lire les étiquettes, à composer vos repas, à manger pour performer — sans frustration, sans obsession.",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80",
  },
  {
    number: "03",
    title: "MENTAL",
    icon: Brain,
    short: "Mindset gagnant, discipline quotidienne.",
    full: "Le mental, c'est 80% du résultat. On travaille votre discipline, votre résilience, votre rapport à l'effort. Parce qu'une bonne journée commence dans la tête.",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80",
  },
  {
    number: "04",
    title: "BIEN-ÊTRE",
    icon: Heart,
    short: "Équilibre de vie, récupération, sommeil.",
    full: "Performance sans récupération = régression. On intègre le sommeil, la gestion du stress et la mobilité dans votre programme. Parce que le corps a besoin de se reconstruire.",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80",
  },
];

export function MethodeSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section
      id="methode"
      ref={ref}
      className="bg-[#0A0A0A] py-24 md:py-32"
      aria-label="La Méthode"
    >
      <div className="section-container">
        {/* Header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="font-body uppercase tracking-[0.3em] text-[#22C55E] text-xs mb-4">
            02 — LA MÉTHODE
          </p>
          <h2 className="font-display text-[clamp(3rem,8vw,7rem)] leading-none tracking-tighter text-white">
            4 PILIERS.
            <br />
            <span style={{ WebkitTextStroke: "2px #FAFAFA", color: "transparent" }}>
              UNE VISION.
            </span>
          </h2>
        </motion.div>

        {/* Grille des piliers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#1F1F1F]">
          {PILLARS.map((pillar, i) => {
            const Icon = pillar.icon;
            const isHovered = hovered === i;

            return (
              <motion.div
                key={pillar.number}
                className="relative bg-[#0A0A0A] p-8 flex flex-col overflow-hidden group"
                style={{ minHeight: "380px" }}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                onHoverStart={() => setHovered(i)}
                onHoverEnd={() => setHovered(null)}
              >
                {/* Image de fond au hover */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-opacity duration-500 ease-in-out"
                  style={{
                    backgroundImage: `url(${pillar.image})`,
                    opacity: isHovered ? 0.12 : 0,
                    transform: isHovered ? "scale(1.05)" : "scale(1)",
                    transition: "opacity 0.5s ease, transform 0.8s ease",
                  }}
                  aria-hidden="true"
                />

                {/* Contenu */}
                <div className="relative z-10 flex flex-col flex-1">
                  {/* Numéro + icône */}
                  <div className="flex items-center justify-between mb-auto">
                    <span
                      className="font-display text-6xl md:text-7xl leading-none tracking-tighter"
                      style={{ WebkitTextStroke: "1px rgba(250,250,250,0.2)", color: "transparent" }}
                    >
                      {pillar.number}
                    </span>
                    <Icon
                      size={32}
                      className="text-[#22C55E] group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  {/* Titre */}
                  <h3 className="font-display text-4xl md:text-5xl leading-none tracking-tighter text-white mt-8 mb-4">
                    {pillar.title}
                  </h3>

                  {/* Description courte / longue */}
                  <p className="font-body text-[#A1A1AA] text-sm leading-relaxed">
                    {isHovered ? pillar.full : pillar.short}
                  </p>

                  {/* Flèche */}
                  <div className="mt-6 flex items-center gap-2 text-[#22C55E] text-sm font-body uppercase tracking-widest">
                    <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
