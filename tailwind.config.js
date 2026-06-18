/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Fredoka One"', 'cursive'],
        body: ['"Nunito"', 'sans-serif'],
      },
      colors: {
        peach:   '#FFD6A5',
        blush:   '#FFCAD4',
        mint:    '#CDEAC0',
        sky:     '#BDE0FE',
        cream:   '#FFF8F0',
        lavender:'#E4C1F9',
        gold:    '#F9C74F',
        teal:    '#80C9A4',
        coral:   '#FF8C69',
        warm:    '#FAF0E6',
      },
      keyframes: {
        wiggle: {
          '0%,100%': { transform: 'rotate(-3deg) scale(1.05)' },
          '50%':     { transform: 'rotate(3deg)  scale(1.1)' },
        },
        pop: {
          '0%':   { transform: 'scale(1)' },
          '50%':  { transform: 'scale(1.25)' },
          '100%': { transform: 'scale(1)' },
        },
        glow: {
          '0%,100%': { boxShadow: '0 0 10px 2px #F9C74F66' },
          '50%':     { boxShadow: '0 0 28px 8px #F9C74FAA' },
        },
      },
      animation: {
        wiggle: 'wiggle 0.4s ease-in-out infinite',
        pop:    'pop 0.3s ease-out',
        glow:   'glow 1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}