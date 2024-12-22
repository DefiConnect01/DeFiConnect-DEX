/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // or 'media' for system preference
  theme: {
    extend: {
      colors: {
        lightBackground: "#ffffff",
        darkBackground: "#060A1A",
        lightText: "#1b1b23",
        darkText: "#ffffff",
        accent: "#8f60ff",
      lightModeGray:"#f1f3f3",
    darkModeGray:"#23232c"},
    },
  },
  plugins: [],
};


