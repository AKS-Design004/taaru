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
        gold: {
          50: "#FDF8E8",
          100: "#F9EDC5",
          200: "#F3DA8A",
          300: "#EDC74F",
          400: "#E0B832",
          500: "#D4AF37",
          600: "#B8962F",
          700: "#9A7D27",
          800: "#7C641F",
          900: "#5E4B17",
        },
        surface: {
          50: "#f8f9fa",
          100: "#f1f3f5",
          200: "#e9ecef",
          300: "#dee2e6",
          400: "#ced4da",
          500: "#adb5bd",
          600: "#868e96",
          700: "#495057",
          800: "#343a40",
          900: "#212529",
          950: "#111111",
        },
        status: {
          success: "#22c55e",
          "success-light": "#4ade80",
          "success-dark": "#16a34a",
          "success-bg": "rgba(34,197,94,0.1)",
          error: "#ef4444",
          "error-light": "#f87171",
          "error-dark": "#dc2626",
          "error-bg": "rgba(239,68,68,0.1)",
          warning: "#f59e0b",
          "warning-light": "#fbbf24",
          "warning-dark": "#d97706",
          "warning-bg": "rgba(245,158,11,0.1)",
        },
      },
      fontFamily: {
        sans: ["Geist", "system-ui", "sans-serif"],
        mono: ["Geist Mono", "monospace"],
        heading: ["var(--font-instrument-serif)", "Georgia", "serif"],
        body: ["var(--font-barlow)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-glow":
          "radial-gradient(ellipse at center, rgba(212,175,55,0.15) 0%, transparent 70%)",
        "dot-grid":
          "radial-gradient(circle, var(--dot-color) 1px, transparent 1px)",
      },
      backgroundSize: {
        "dot-grid": "24px 24px",
      },
      boxShadow: {
        gold: "0 0 30px -5px rgba(212, 175, 55, 0.15)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "pulse-slow": "pulse 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
