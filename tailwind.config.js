/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'star-wars': {
          yellow: '#FFE81F',
          blue: '#005FCC',
          red: '#BB0000',
          black: '#000000',
          gray: {
            light: '#C0C0C0',
            dark: '#2A2A2A'
          }
        }
      },
      fontFamily: {
        'star-wars': ['Arial', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s linear infinite',
        'bounce-slow': 'bounce 2s infinite',
      }
    },
  },
  plugins: [],
}