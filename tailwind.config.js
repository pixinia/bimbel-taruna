/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html', './assets/js/*.js'],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0B1426',
          800: '#111D35',
          700: '#1A2A4A',
          100: '#DCE4F0',
          50: '#EEF2F8',
        },
        sand: {
          DEFAULT: '#F7F5F0',
          100: '#F7F5F0',
          200: '#EFEBE2',
        },
        olive: {
          DEFAULT: '#4B5320',
          900: '#2E3413',
          800: '#3A4119',
          700: '#4B5320',
          500: '#6B7A3A',
          300: '#9AAA64',
        },
        gold: {
          DEFAULT: '#C9A227',
          light: '#E3C35A',
          dark: '#A6851C',
          deep: '#8A6D12',
        },
      },
      fontFamily: {
        display: ['Oswald', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(1)', opacity: '0.7' },
          '100%': { transform: 'scale(1.8)', opacity: '0' },
        },
        bob: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(6px)' },
        },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        pulseRing: 'pulseRing 2s cubic-bezier(0.4,0,0.6,1) infinite',
        bob: 'bob 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
