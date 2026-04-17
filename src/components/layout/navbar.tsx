"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

const navLinks = [
  { href: "#coach", label: "01 COACH" },
  { href: "#quiz", label: "02 QUIZ" },
  { href: "#journal", label: "03 JOURNAL" },
  { href: "#contact", label: "04 CONTACT" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#1F1F1F]"
          : "bg-transparent"
      }`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="section-container flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-display text-2xl md:text-3xl tracking-tighter text-white group-hover:text-[#22C55E] transition-colors duration-300">
            ATLAS
          </span>
          <span className="font-display text-2xl md:text-3xl tracking-tighter text-[#22C55E]">
            FITNESS
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink key={link.href} href={link.href}>
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <Link
            href="/reserver"
            className="hidden md:flex items-center gap-2 bg-[#22C55E] text-black font-body font-700 uppercase tracking-widest text-xs px-6 py-3 hover:bg-[#16A34A] transition-colors duration-300 group"
          >
            RÉSERVER
            <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
          </Link>

          {/* Burger mobile */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
            aria-expanded={menuOpen}
          >
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                menuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                menuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <motion.div
        className="md:hidden overflow-hidden bg-[#0A0A0A] border-t border-[#1F1F1F]"
        initial={false}
        animate={{ height: menuOpen ? "auto" : 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="section-container py-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-body uppercase tracking-widest text-sm text-[#A1A1AA] hover:text-white transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/reserver"
            className="mt-4 inline-flex items-center gap-2 bg-[#22C55E] text-black font-body font-semibold uppercase tracking-widest text-sm px-6 py-3 w-full justify-center"
            onClick={() => setMenuOpen(false)}
          >
            RÉSERVER →
          </Link>
        </div>
      </motion.div>
    </motion.nav>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="relative font-body uppercase tracking-widest text-xs text-[#A1A1AA] hover:text-white transition-colors duration-300 group"
    >
      {children}
      <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#22C55E] group-hover:w-full transition-all duration-300" />
    </Link>
  );
}
