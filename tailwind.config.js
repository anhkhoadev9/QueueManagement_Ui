/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vietin: {
          blue: '#005B9C',
          red: '#E31837',
          lightBlue: '#E6EFFF',
          darkBlue: '#004273'
        }
      }
    },
  },
  plugins: [],
}
