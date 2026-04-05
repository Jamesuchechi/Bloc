/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0c0c0b",
        chalk: "#f0ece4",
        mist: "#d6d1c7",
        amber: {
          DEFAULT: "#e8a020",
          dim: "#a06d10",
        },
        surface: "#161613",
        surface2: "#1e1d1a",
        border: "#2a2925",
        border2: "#3a3832",
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
