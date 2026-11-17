import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Design System - Brand & Accents
        "brand-primary": "#5B3DF5",
        "brand-primary-dark": "#3A22C8",
        "brand-primary-light": "#EEEAFF",
        "brand-primary-border": "#D9D2FF",
        "brand-gold": "#FFB84D",
        "brand-magenta": "#EC4899",
        "brand-cyan": "#06B6D4",

        // Surfaces
        "surface-dark": "#0B0A14",
        "surface-dark-card": "#1B1A26",
        "surface-light": "#F7F7FB",
        "surface-card": "#FFFFFF",

        // Borders & Texts
        "border-dark": "#2E2C40",
        "border-light": "#E3E3EE",
        "border-input": "#CFCFE0",
        "text-main": "#12122A",
        "text-muted": "#5A5A70",

        // Legacy compat tokens
        bg: "var(--bg)",
        surface: "var(--surface)",
        border: "var(--border)",
        accent: "#5B3DF5",
        "accent-hover": "#3A22C8",
        "accent-soft": "#EEEAFF",
        "on-accent": "#FFFFFF",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
        "serif-drama": ["Playfair Display", "Georgia", "serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      keyframes: {
        lakeFlow: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        fl: {
          "0%, 100%": { transform: "translateY(0px) rotateX(0deg) rotateY(0deg)" },
          "50%": { transform: "translateY(-12px) rotateX(2deg) rotateY(-2deg)" },
        },
        coinSpin: {
          "0%": { transform: "rotateY(0deg) rotateX(10deg)" },
          "50%": { transform: "rotateY(180deg) rotateX(-10deg)" },
          "100%": { transform: "rotateY(360deg) rotateX(10deg)" },
        },
        perpetualMarquee: {
          "0%": { transform: "translate3d(0, 0, 0)" },
          "100%": { transform: "translate3d(-50%, 0, 0)" },
        },
      },
      animation: {
        "lake-flow": "lakeFlow 10s ease-in-out infinite",
        fl: "fl 6s ease-in-out infinite",
        "coin-spin-3d": "coinSpin 12s linear infinite",
        marquee: "perpetualMarquee 28s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
