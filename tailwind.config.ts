import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#07090f",
          900: "#0b0f18",
          850: "#0f1420",
          800: "#141b2a",
          700: "#1d2637",
          600: "#2a3549",
        },
        gold: {
          50: "#fdf9ef",
          100: "#f8eed6",
          200: "#efdcae",
          300: "#e4c47c",
          400: "#d8ab52",
          500: "#c8912f",
          600: "#a97324",
          700: "#85571f",
          800: "#6a4520",
          900: "#59391e",
        },
        surface: {
          DEFAULT: "#fbfaf7",
          muted: "#f1efe9",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        lift: "0 24px 60px -30px rgba(0,0,0,0.7)",
        glow: "0 0 0 1px rgba(216,171,82,0.25), 0 20px 50px -25px rgba(216,171,82,0.35)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "confetti-fall": {
          "0%": { transform: "translateY(-10vh) rotate(0deg)", opacity: "0" },
          "10%": { opacity: "1" },
          "100%": { transform: "translateY(110vh) rotate(720deg)", opacity: "0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
        shimmer: "shimmer 2.5s linear infinite",
        "confetti-fall": "confetti-fall 3s ease-in forwards",
      },
    },
  },
  plugins: [],
};

export default config;
