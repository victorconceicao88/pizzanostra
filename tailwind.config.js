/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@headlessui/react/dist/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        green: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#016730', // Your primary green
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        'italy-green': '#008C45',
        'italy-white': '#F4F5F0',
        'italy-red': '#CD212A',
      },
      boxShadow: {
        'input-focus': '0 0 0 2px rgba(1, 103, 48, 0.5)',
        'dropdown': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      transitionProperty: {
        'height': 'height',
        'opacity': 'opacity',
        'transform': 'transform',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 100ms ease-out',
        'fade-out': 'fade-out 100ms ease-out',
      },
    },
  },
}