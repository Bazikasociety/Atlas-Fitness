"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Mail } from "lucide-react";

export function ContactSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="contact"
      ref={ref}
      className="relative bg-[#0A0A0A] py-24 md:py-32 overflow-hidden border-t border-[#1F1F1F]"
      aria-label="Contact"
    >
      {/* Grand texte décoratif en fond */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <span
          className="font-display text-[clamp(5rem,18vw,14rem)] leading-none tracking-tighter whitespace-nowrap"
          style={{ WebkitTextStroke: "1px rgba(250,250,250,0.04)", color: "transparent" }}
        >
          ATLAS FITNESS
        </span>
      </div>

      <div className="section-container relative z-10">
        {/* Header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="font-body uppercase tracking-[0.3em] text-[#22C55E] text-xs mb-4">
            06 — CONTACT
          </p>
          <h2 className="font-display text-[clamp(3rem,9vw,8rem)] leading-none tracking-tighter text-white">
            PRÊT À
            <br />
            <span style={{ WebkitTextStroke: "2px #FAFAFA", color: "transparent" }}>
              COMMENCER ?
            </span>
          </h2>
        </motion.div>

        {/* Bloc contact — Email uniquement */}
        <div className="max-w-xl mb-10">
          <motion.a
            href="mailto:societebazika@gmail.com"
            className="group flex items-center gap-6 border border-[#1F1F1F] p-6 hover:border-[#22C55E] transition-colors duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            <Mail size={20} className="text-[#22C55E] flex-shrink-0" />
            <div>
              <p className="font-body text-xs uppercase tracking-widest text-[#A1A1AA] mb-1">
                EMAIL
              </p>
              <p className="font-body font-semibold text-white group-hover:text-[#22C55E] transition-colors text-sm">
                societebazika@gmail.com
              </p>
            </div>
          </motion.a>
        </div>

        <motion.p
          className="font-body text-[#A1A1AA] text-sm italic"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Réponse sous 24h. Pas de formulaire inutile, pas de blabla.
        </motion.p>
      </div>
    </section>
  );
}
