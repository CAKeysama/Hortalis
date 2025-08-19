/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './autores.html',
    './js/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: '#1A6410',
          DEFAULT: '#007C46',
          light: '#6A9D4D',
        },
        neutral: {
          dark: '#0D0D0D',
          light: '#F1F1F1',
        },
        accent: '#406FDB',
      },
      fontFamily: {
        raleway: ['Raleway', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
};