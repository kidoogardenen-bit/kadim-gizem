import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

/**
 * Tailwind v4 config.
 * Most tokens (colors, fonts, radii) are defined via @theme in globals.css.
 * This file exists for plugins (typography) and extra keyframes/animations
 * that are easier to express in JS, and is loaded from globals.css via
 * `@config "../../tailwind.config.ts";`.
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{ts,tsx,js,jsx,mdx}",
    "./src/app/**/*.{ts,tsx,mdx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cinzel"', "ui-serif", "Georgia", "serif"],
        serif: ['"Cormorant Garamond"', "ui-serif", "Georgia", "serif"],
        sans: ['"Inter"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        parchment: {
          DEFAULT: "var(--parchment)",
          dark: "var(--parchment-dark)",
        },
        ink: {
          DEFAULT: "var(--ink)",
          light: "var(--ink-light)",
        },
        gold: {
          DEFAULT: "var(--gold)",
          light: "var(--gold-light)",
          dark: "var(--gold-dark)",
        },
        crimson: {
          DEFAULT: "var(--crimson)",
          light: "var(--crimson-light)",
        },
        shadow: "var(--shadow)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(212, 168, 87, 0.2)" },
          "50%": { boxShadow: "0 0 40px rgba(212, 168, 87, 0.5)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.6s ease-out",
        "slide-up": "slide-up 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
        glow: "glow 3s ease-in-out infinite",
      },
      typography: {
        DEFAULT: {
          css: {
            "--tw-prose-body": "var(--ink)",
            "--tw-prose-headings": "var(--ink)",
            "--tw-prose-links": "var(--gold-dark)",
            "--tw-prose-bold": "var(--ink)",
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: "1.125rem",
            lineHeight: "1.75",
          },
        },
        invert: {
          css: {
            "--tw-prose-body": "var(--ink)",
            "--tw-prose-headings": "var(--ink)",
            "--tw-prose-links": "var(--gold-light)",
            "--tw-prose-bold": "var(--ink)",
          },
        },
      },
    },
  },
  plugins: [typography],
};

export default config;
