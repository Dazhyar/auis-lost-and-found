/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'auis-blue': '#002D72',
        'auis-blue-dark': '#001a45',
        'auis-gold': '#D4AF37',
        'auis-gold-light': '#ebd079',
        'auis-gray-light': '#f5f7fa',
        'auis-gray-dark': '#1a202c',
        'auis-glass': 'rgba(255, 255, 255, 0.08)',
        'auis-glass-border': 'rgba(255, 255, 255, 0.15)',
        'auis-card': 'rgba(255, 255, 255, 0.95)',
      },
      fontFamily: {
        sans: ['Lexend', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        }
      }
    },
  },
  plugins: [],
}
