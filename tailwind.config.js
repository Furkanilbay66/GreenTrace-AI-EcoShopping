/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        eco: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e', // Vibrant Pistachio Green
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          accent: '#84cc16', // Bright Lime-Pistachio
        },
        beige: {
          50: '#fdfbf7',
          100: '#f9f6ef',
          200: '#f3ede0',
          300: '#e7dcc7',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glass-hover': '0 14px 40px 0 rgba(31, 38, 135, 0.12)',
        'glow-green': '0 0 25px -5px rgba(34, 197, 94, 0.4)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
