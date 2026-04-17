import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t-2 border-[#22C55E]">
      <div className="section-container py-8 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="font-display text-2xl tracking-tighter">
          ATLAS<span className="text-[#22C55E]">FITNESS</span>
        </Link>

        {/* Copyright */}
        <p className="font-body text-xs text-[#A1A1AA] text-center">
          © {new Date().getFullYear()} Atlas Fitness · Yann Bazika · Tous droits réservés
        </p>

        {/* Réseaux sociaux */}
        <div className="flex items-center gap-4">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram Atlas Fitness"
            className="text-[#A1A1AA] hover:text-[#22C55E] transition-colors duration-300"
          >
            {/* Instagram SVG */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
            </svg>
          </a>
          {/* TikTok SVG */}
          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok Atlas Fitness"
            className="text-[#A1A1AA] hover:text-[#22C55E] transition-colors duration-300"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.11a8.16 8.16 0 004.77 1.52V7.19a4.85 4.85 0 01-1-.5z" />
            </svg>
          </a>
          {/* YouTube SVG */}
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube Atlas Fitness"
            className="text-[#A1A1AA] hover:text-[#22C55E] transition-colors duration-300"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
