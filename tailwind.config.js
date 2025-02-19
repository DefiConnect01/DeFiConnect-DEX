/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // or 'media' for system preference
  theme: {
    extend: {
      backgroundImage: {
        'custom-gradient': 'linear-gradient(to right, #140084, #060A1A, #140084)',
      },
      colors: {
        primary:"#140084",
        primaryBackground: "#2B1990",
        lightBackground: "#ffffff",
        purple:"#854CFF",
        darkBackground: "#060A1A",
        headerBg: "#0A0D26",
        mainBg: "#060A1A",
        secondary:"#652400",
        secondaryBg:"#140084",
        lightText: "#1b1b23",
        darkText: "#ffffff",
        accent: "#8f60ff",
        lightModeGray:"#f1f3f3",
        darkModeGray:"#23232c",
        textGray: "#c6cdd2",
        black:"#0c0c0c",
  },
    },
  },
  plugins: [],
};


