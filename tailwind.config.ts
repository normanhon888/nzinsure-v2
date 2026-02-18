import type { Config } from "tailwindcss";
import tokens from "./design-tokens/tokens.json";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: tokens.color.primary,
        accent: tokens.color.accent,
        surface: tokens.color.surface,
        background: tokens.color.background,
      },
      borderRadius: {
        card: tokens.radius.card,
        button: tokens.radius.button,
      },
      spacing: {
        section: tokens.spacing.section,
        sectionMedium: tokens.spacing.sectionMedium,
        cardPadding: tokens.spacing.cardPadding,
      },
      fontSize: {
        h1: tokens.typography.h1Size,
        h2: tokens.typography.h2Size,
      },
    },
  },
};

export default config;
