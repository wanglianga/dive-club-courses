/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,vue}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        ocean: {
          50: "#e6f7fa",
          100: "#b3e8f1",
          200: "#80d9e7",
          300: "#4dcade",
          400: "#1abcd4",
          500: "#0099bb",
          600: "#007a99",
          700: "#005c77",
          800: "#003d55",
          900: "#001f33",
          950: "#000d1a",
        },
        coral: {
          50: "#fff1f0",
          100: "#ffd4cc",
          200: "#ffb8a3",
          300: "#ff9b7a",
          400: "#ff7e52",
          500: "#ff6b35",
          600: "#e55020",
          700: "#c43e12",
          800: "#9e310e",
          900: "#7a250a",
        },
        sand: {
          50: "#fdf8f3",
          100: "#f5e6d3",
          200: "#ebd0ae",
          300: "#e0b988",
          400: "#d4a263",
          500: "#c98d3f",
          600: "#b07530",
          700: "#8f5c25",
          800: "#72471c",
          900: "#573514",
        },
        kelp: {
          50: "#eaf5eb",
          100: "#c4e6c8",
          200: "#9ed7a4",
          300: "#78c881",
          400: "#52b95e",
          500: "#2faa3f",
          600: "#228c30",
          700: "#196e24",
          800: "#115018",
          900: "#09320d",
        },
      },
      backgroundImage: {
        "ocean-gradient":
          "linear-gradient(180deg, #001f33 0%, #003d55 30%, #005c77 60%, #007a99 100%)",
        "ocean-shallow":
          "linear-gradient(180deg, #1abcd4 0%, #0099bb 50%, #007a99 100%)",
        "coral-gradient":
          "linear-gradient(135deg, #ff7e52 0%, #ff6b35 50%, #e55020 100%)",
      },
      animation: {
        "wave-slow": "wave 8s ease-in-out infinite",
        "float-slow": "float 6s ease-in-out infinite",
        "bubble": "bubble 4s ease-in-out infinite",
      },
      keyframes: {
        wave: {
          "0%, 100%": { transform: "translateX(0) translateY(0)" },
          "50%": { transform: "translateX(-20px) translateY(-5px)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        bubble: {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "50%": { opacity: "0.6" },
          "100%": { transform: "translateY(-100%)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
