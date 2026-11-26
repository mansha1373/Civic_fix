/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        civic: {
          cream: "#FFF9EA",
          yellow: "#FFD20A",
          burgundy: "#59343B",
          espresso: "#281719",
          beige: "#EAE3D5",
        }
      },
      boxShadow: {
        civic: "0 4px 20px -2px rgba(40, 23, 25, 0.05), 0 2px 6px -1px rgba(40, 23, 25, 0.03)",
      }
    },
  },
  plugins: [],
}
