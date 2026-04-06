/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "var(--ink)",
        chalk: "var(--chalk)",
        mist: "var(--mist)",
        amber: {
          DEFAULT: "var(--amber)",
          dim: "var(--amber-dim)",
        },
        surface: "var(--surface)",
        surface2: "var(--surface2)",
        border: "var(--border)",
        border2: "var(--border2)",
      },
      fontFamily: {
        bebas: ["'Bebas Neue'", "cursive"],
        instrument: ["'Instrument Serif'", "serif"],
        mono: ["'DM Mono'", "monospace"],
        sora: ["'Sora'", "sans-serif"],
      },
      letterSpacing: {
        widest: ".35em",
        tighter: "-.02em",
      },
      animation: {
        ticker: "ticker 25s linear infinite",
        pulse: "pulse 2s ease-in-out infinite",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: ".5", transform: "scale(.8)" },
        },
      },
    },
  },
  plugins: [],
}
