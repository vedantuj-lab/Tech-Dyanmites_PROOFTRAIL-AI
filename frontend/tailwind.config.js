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
        feature: {
          home: '#F59E0B',
          research: '#10B981',
          workspace: '#14B8A6',
          importer: '#F97316',
          documents: '#8B5CF6',
          evidence: '#34D399',
          map: '#F43F5E',
          conflicts: '#E11D48',
          quality: '#84CC16',
          decisions: '#D97706',
          reports: '#64748B',
          history: '#6366F1',
          reviewer: '#EC4899',
          admin: '#38BDF8',
        },
      },
    },
  },
  plugins: [],
}
