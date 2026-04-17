"use client";

import { useEffect, useRef, ReactNode } from "react";

interface SmoothScrollProps {
  children: ReactNode;
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<import("lenis").default | null>(null);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    async function initLenis() {
      const Lenis = (await import("lenis")).default;
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      lenisRef.current = lenis;

      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }

    initLenis();

    return () => {
      lenisRef.current?.destroy();
    };
  }, []);

  return <>{children}</>;
}
