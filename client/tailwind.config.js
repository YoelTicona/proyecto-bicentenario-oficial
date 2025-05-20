module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // para todos los archivos que usan clases Tailwind
  ],
  theme: {
    extend: {
      textShadow: {
        sm: '1px 1px 2px rgba(0, 0, 0, 0.7)',
        DEFAULT: '2px 2px 4px rgba(0, 0, 0, 0.7)',
        lg: '3px 3px 6px rgba(0, 0, 0, 0.7)',
      },
    },
  },
  plugins: [
    require('tailwindcss-textshadow'),
    require('tailwind-scrollbar-hide')
  ],
}
