/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html', './assets/js/*.js'],
  theme: {
    extend: {
      colors: {
        kertas: '#FFFFFF',
        abu: '#F1F1EE',
        garis: '#D9D9D4',
        tinta: {
          DEFAULT: '#1B1F23',
          2: '#4A5058',
        },
        loreng: '#3E4A2C',
        merah: {
          DEFAULT: '#B3122A',
          hover: '#8F0E21',
        },
      },
      fontFamily: {
        display: ['"Big Shoulders Display"', 'ui-sans-serif', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
