/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1da1f2',
        secondary: '#657786',
        accent: '#14171a',
        extraLight: '#e1e8ed',
        light: '#f5f8fa',
      },
    },
  },
  plugins: [],
}
