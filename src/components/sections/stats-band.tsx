"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useEffect, useState } from "react";

const STATS = [
  { value: 150, suffix: "€", label: "PAR MOIS", prefix: "" },
  { value: 3, suffix: "", label: "SÉANCES / MOIS", prefix: "2-" },
  { value: 100, suffix: "%", label: "PERSONNALISÉ", prefix: "" },
  { value: 0, suffix: "∞", label: "SUIVI ILLIMITÉ", prefix: "" },
];

function Counter({
  target,
  suffix,
  prefix,
  isInfinity,
}: {
  target: number;
  suffix: string;
  prefix: string;
  isInfinity: boolean;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!inView || isInfinity) return;
    const duration = 1500;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target, isInfinity]);

  return (
    <span ref={ref}>
      {isInfinity ? "∞" : `${prefix}${count}${suffix}`}
    </span>
  );
}

export function StatsBand() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section
      ref={ref}
      className="bg-[#0A0A0A] border-y border-[#1F1F1F] py-16 md:py-20 overflow-hidden"
      aria-label="Chiffres clés"
    >
      <div className="section-container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center md:border-r border-[#1F1F1F] last:border-0"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="font-display text-[clamp(3rem,8vw,6rem)] leading-none tracking-tighter text-white">
                <Counter
                  target={stat.value}
                  suffix={stat.suffix}
                  prefix={stat.prefix}
                  isInfinity={stat.suffix === "∞"}
                />
              </div>
              <p className="font-body uppercase tracking-[0.2em] text-[#A1A1AA] text-xs mt-2">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
