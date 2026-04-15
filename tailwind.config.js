/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Thème accessibilité : vert + bleu + blanc
        primary: {
          50: '#f0fdf4',
          500: '#22c55e',  // vert accessibilité
          600: '#16a34a',
        },
        accent: {
          500: '#3b82f6',  // bleu
          600: '#2563eb',
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}