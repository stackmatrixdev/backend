/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        Poppins: ["Poppins", "serif"],
        Inter: ["Inter", "serif"],
      },
      colors: {
        primary: "#189DFE",
        secondary: "#0061BF",
        dark: "#6E6E6E",
        gray: "#929292",
        light: "#C5E7FF",
        login: "#F0F8FF",
        light: "#7B7B7B",
        circle: '#C9E4FB'
      },
    },
  },
  plugins: [],
};
