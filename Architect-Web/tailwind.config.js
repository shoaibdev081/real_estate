/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        camel: {
          DEFAULT: '#CAA05C',
          50: '#f7f4f0',
          100: '#ede8e0',
          200: '#e0d4bd',
          300: '#d4c09b',
          400: '#c7ac79',
          500: '#CAA05C',
          600: '#b8934a',
          700: '#9d7d3e',
          800: '#7a6232',
          900: '#5a4926',
        },
      },
      fontFamily: {
        generalsans: ['GeneralSans-Semibold', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
