// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0a1628',
        'navy-900': '#060d1f',
        'blue-900': '#0f2356',
        'blue-800': '#1e3a8a',
        'blue-600': '#2563eb',
        'sky-500': '#0ea5e9',
        'sky-400': '#38bdf8',
      },
      fontFamily: {
        'display': ['"Plus Jakarta Sans"', '"DM Sans"', 'sans-serif'],
        'body': ['"DM Sans"', 'sans-serif'],
      },
      animation: {
        'pulse2': 'pulse2 2s ease-in-out infinite',
      },
      keyframes: {
        pulse2: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
      },
    },
  },
  plugins: [],
}