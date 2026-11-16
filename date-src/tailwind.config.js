/** City Pop palette: warm sunsets, soft creams, deep navy */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: { 950: "#0a0d28", 900: "#0f1438", 800: "#171d4d", 700: "#232b66", 600: "#3a4388" },
        cream: { DEFAULT: "#fff4e6", 200: "#ffe9d0", 300: "#f6d9b8" },
        sun: { coral: "#ff6f61", pink: "#ff5c8a", amber: "#ffb25b", peach: "#ffd3a5", dusk: "#b38cff" }
      },
      fontFamily: {
        display: ['"Fraunces"', "Georgia", "serif"],
        body: ['"Outfit"', "system-ui", "sans-serif"]
      },
      backgroundImage: {
        sunset: "linear-gradient(135deg,#ffd27a 0%,#ff8a5b 45%,#ff4f8b 100%)"
      }
    }
  },
  plugins: []
};
