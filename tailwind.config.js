/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "matte-black": "#0E0E10",
        "dark-slate": "#1D1F24",
        "surface-panel": "#17181C",
        "border-slate": "#2A2A2A",
        "muted-gold": "#D4AF37",
        "primary": "#D4AF37",
        "primary-fixed": "#FFE088",
        "surface": "#121414",
        "surface-container-lowest": "#0D0E0F",
        "surface-container-low": "#1A1C1C",
        "surface-container": "#1E2020",
        "surface-container-high": "#292A2A",
        "surface-container-highest": "#343535",
        "on-surface": "#E3E2E2",
        "on-surface-variant": "#D0C5AF",
        "outline-variant": "#4D4635",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Geist', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
