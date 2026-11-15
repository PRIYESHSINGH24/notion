/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        notion: {
          bg: '#ffffff',
          darkBg: '#191919',
          sidebar: '#f7f6f3',
          darkSidebar: '#202020',
          hover: '#efeee9',
          darkHover: '#2b2b2b',
          border: '#e9e9e7',
          darkBorder: '#2f2f2f',
          text: '#37352f',
          darkText: '#d4d4d4',
          muted: '#787774',
          darkMuted: '#9b9a97',
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
