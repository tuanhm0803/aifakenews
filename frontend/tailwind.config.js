/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'manteiv-blue': '#1e40af',
        'manteiv-gold': '#f59e0b',
      }
    },
  },
  plugins: [],
}
