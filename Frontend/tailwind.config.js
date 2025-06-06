/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  
  theme: {
    extend: {
      colors: {
        primary: "#36b4bc",
        secondary: "rgba(54, 180, 188, 0.9)",
        dark: {
          primary: "#1a1a1a",
          secondary: "#2d2d2d",
          accent: "#36b4bc",
        },
      },
    },
  },
  plugins: [],
};
