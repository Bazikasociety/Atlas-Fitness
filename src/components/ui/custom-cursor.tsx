"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [isPointer, setIsPointer] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true); // true par défaut (SSR-safe)

  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Désactivé sur les appareils tactiles (mobile, tablette)
    // (pointer: coarse) = écran tactile, (pointer: fine) = souris
    const isTouch = window.matchMedia("(pointer: coarse)").matches || window.matchMedia("(hover: none)").matches;
    setIsTouchDevice(isTouch);
    if (isTouch) return;

    // Vérification prefers-reduced-motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 8);
      cursorY.set(e.clientY - 8);
    };

    const checkPointer = () => {
      const el = document.elementFromPoint(
        cursorX.get() + 8,
        cursorY.get() + 8
      );
      if (!el) return;
      const style = window.getComputedStyle(el);
      const isClickable =
        el.tagName === "A" ||
        el.tagName === "BUTTON" ||
        el.closest("a") !== null ||
        el.closest("button") !== null ||
        style.cursor === "pointer";
      setIsPointer(isClickable);
    };

    const hideCursor = () => setIsHidden(true);
    const showCursor = () => setIsHidden(false);

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mousemove", checkPointer);
    document.addEventListener("mouseleave", hideCursor);
    document.addEventListener("mouseenter", showCursor);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mousemove", checkPointer);
      document.removeEventListener("mouseleave", hideCursor);
      document.removeEventListener("mouseenter", showCursor);
    };
  }, [cursorX, cursorY]);

  // Ne rien rendre sur mobile/tablette
  if (isTouchDevice) return null;

  return (
    <>
      {/* Cercle principal */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full border border-[#22C55E] mix-blend-difference"
        style={{
          x: springX,
          y: springY,
          width: isPointer ? 28 : 16,
          height: isPointer ? 28 : 16,
          marginLeft: isPointer ? -6 : 0,
          marginTop: isPointer ? -6 : 0,
          opacity: isHidden ? 0 : 1,
          backgroundColor: isPointer ? "rgba(34,197,94,0.15)" : "transparent",
          transition: "width 0.2s ease, height 0.2s ease, background-color 0.2s ease, margin 0.2s ease",
        }}
      />
      {/* Point central */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full bg-[#22C55E]"
        style={{
          x: cursorX,
          y: cursorY,
          width: 3,
          height: 3,
          marginLeft: 6.5,
          marginTop: 6.5,
          opacity: isHidden ? 0 : 1,
        }}
      />
    </>
  );
}
