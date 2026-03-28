import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  "#f0f4ff",
          100: "#e0e9ff",
          200: "#c1d3ff",
          300: "#a2bbff",
          400: "#7c9eff",
          500: "#5b81f5",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        // Dark Mode Palette (Apple/Stripe Level)
        dark: {
          bg: "#0A0A0A",              // Main background
          card: "#151515",            // Card background
          "card-hover": "#1F1F1F",    // Card on hover
          secondary: "#1A1A1A",       // Secondary background
          tertiary: "#262626",        // Tertiary background
          border: "#333333",          // Border color
          text: "#FFFFFF",            // Primary text
          "text-secondary": "#E0E0E0",// Secondary text
          "text-tertiary": "#A0A0A0", // Tertiary text
          "input-bg": "#151515",      // Input background
          "button-hover": "#2A2A2A",  // Button hover
        },
        surface: {
          DEFAULT: "#ffffff",
          50:  "#fafafa",
          100: "#f5f5f7",
          200: "#f5f5f7",
          card: "#ffffff",
          dark: "#0A0A0A",            // Changed to #0A0A0A (main bg)
          "dark-50": "#262626",       // Changed to tertiary
          "dark-100": "#1A1A1A",      // Changed to secondary
          "dark-200": "#151515",      // Changed to card
          "dark-300": "#1F1F1F",      // Changed to card hover
          "dark-card": "#151515",     // Changed to card
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "fade-in":   "fadeIn 0.3s ease-in-out",
        "slide-up":  "slideUp 0.4s ease-out",
      },
      keyframes: {
        fadeIn:  { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: { "0%": { transform: "translateY(12px)", opacity: "0" }, "100%": { transform: "translateY(0)", opacity: "1" } },
      },
      boxShadow: {
        "subtle": "0 1px 3px rgba(0,0,0,0.08)",
        "card":   "0 2px 8px rgba(0,0,0,0.06)",
        "dark-card": "0 2px 8px rgba(0,0,0,0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
