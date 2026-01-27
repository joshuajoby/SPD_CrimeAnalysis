export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1e3a8a',
          dark: '#1e293b',
          light: '#3b82f6'
        },
        accent: {
          DEFAULT: '#dc2626',
          light: '#ef4444'
        }
      }
    },
  },
  plugins: [],
}
