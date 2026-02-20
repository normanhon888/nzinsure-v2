import type { Config } from "tailwindcss";
import tokens from "./design-tokens/tokens.json";

const t = tokens.global;

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        accent: "var(--color-accent)",
        background: "var(--color-background)",
        surface: "var(--color-surface)",
      },

      borderRadius: {
        card: t.radius.card.value,
        button: t.radius.button.value,
      },
      spacing: {
        section: t.spacing.section.value,
        sectionMedium: t.spacing.sectionMedium.value,
        cardPadding: t.spacing.cardPadding.value,
      },
      fontSize: {
        h1: t.fontSize.h1.value,
        h2: t.fontSize.h2.value,
      },
      fontWeight: {
        semibold: t.fontWeight.semibold.value,
      },
      lineHeight: {
        tight: t.lineHeight.tight.value,
      },
    },
  },
};

export default config;
