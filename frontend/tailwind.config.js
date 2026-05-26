/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8B5CF6',
        accent: '#EC4899',
        secondary: '#22D3EE',
        background: {
          start: '#0f172a',
          end: '#020617',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'Montserrat', 'Bebas Neue', 'sans-serif'],
        heading: ['Bebas Neue', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
