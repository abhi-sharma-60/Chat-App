/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#36b4bc",
        secondary: "rgba(54, 180, 188, 0.9)", // 90% opacity
      },
    },
  },
  plugins: [],
};
