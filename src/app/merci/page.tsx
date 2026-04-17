"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";

export default function MerciPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6">
        <div className="text-center max-w-2xl">

          {/* Checkmark animé */}
          <motion.div
            className="mb-12 flex justify-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <svg
              width="80"
              height="80"
              viewBox="0 0 80 80"
              fill="none"
              aria-hidden="true"
            >
              {/* Cercle */}
              <motion.circle
                cx="40"
                cy="40"
                r="38"
                stroke="#22C55E"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
              {/* Check */}
              <motion.path
                d="M22 40 L34 52 L58 28"
                stroke="#22C55E"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
              />
            </svg>
          </motion.div>

          {/* Titre */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <p className="font-body uppercase tracking-[0.3em] text-[#22C55E] text-xs mb-4">
              — RÉSERVATION CONFIRMÉE
            </p>
            <h1 className="font-display text-[clamp(2.5rem,8vw,6rem)] leading-none tracking-tighter text-white mb-6">
              BIENVENUE DANS
              <br />
              <span className="text-outline-2 text-white">ATLAS FITNESS</span>
            </h1>
          </motion.div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="space-y-4 mb-16"
          >
            <p className="font-body text-[#FAFAFA] text-lg leading-relaxed">
              Votre demande a bien été reçue.
            </p>
            <p className="font-body text-[#A1A1AA] leading-relaxed">
              Je vous recontacte sous 24h pour confirmer votre créneau.
            </p>
            <div className="flex items-center justify-center gap-6 mt-6 font-body text-sm text-[#A1A1AA] border-t border-[#1F1F1F] pt-6">
              <a
                href="mailto:societebazika@gmail.com"
                className="hover:text-[#22C55E] transition-colors"
              >
                societebazika@gmail.com
              </a>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/"
              className="group inline-flex items-center justify-center gap-3 bg-white text-black font-body font-semibold uppercase tracking-widest text-sm px-10 py-5 hover:bg-[#22C55E] transition-colors duration-300"
            >
              RETOUR À L'ACCUEIL
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link
              href="/journal"
              className="inline-flex items-center justify-center gap-3 border border-[#1F1F1F] font-body text-xs uppercase tracking-widest text-[#A1A1AA] px-8 py-5 hover:border-white hover:text-white transition-colors"
            >
              LIRE LE JOURNAL
            </Link>
          </motion.div>

        </div>
      </main>
    </>
  );
}
