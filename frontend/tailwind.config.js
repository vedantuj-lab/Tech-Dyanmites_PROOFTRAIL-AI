/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#090D16',
        surface: {
          DEFAULT: '#131B2E',
          hover: '#1E293B',
          border: '#2A364F',
        },
        brand: {
          amber: '#F59E0B',
          amberDark: '#D97706',
          emerald: '#10B981',
          emeraldDark: '#059669',
        },
      },
    },
  },
  plugins: [],
}
