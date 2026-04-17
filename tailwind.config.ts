import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Atlas Fitness — palette Nike-inspired
        black: "#0A0A0A",
        white: "#FAFAFA",
        green: {
          DEFAULT: "#22C55E",
          hover: "#16A34A",
          dark: "#15803D",
        },
        zinc: {
          800: "#1F1F1F",
          400: "#A1A1AA",
          200: "#E4E4E7",
        },
      },
      fontFamily: {
        display: ["var(--font-anton)", "Impact", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        accent: ["var(--font-caveat)", "cursive"],
      },
      fontSize: {
        "10xl": ["10rem", { lineHeight: "0.9" }],
        "11xl": ["12rem", { lineHeight: "0.85" }],
        "12xl": ["14rem", { lineHeight: "0.85" }],
      },
      letterSpacing: {
        tightest: "-0.05em",
        tighter: "-0.04em",
        tight: "-0.02em",
        widest: "0.3em",
      },
      animation: {
        "ticker": "ticker 30s linear infinite",
        "ticker-slow": "ticker 50s linear infinite",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "ken-burns": "kenBurns 20s ease-in-out infinite alternate",
        "draw-line": "drawLine 2s ease-in-out forwards",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        kenBurns: {
          "0%": { transform: "scale(1) translate(0, 0)" },
          "100%": { transform: "scale(1.08) translate(-2%, -1%)" },
        },
        drawLine: {
          "0%": { strokeDashoffset: "1000" },
          "100%": { strokeDashoffset: "0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
