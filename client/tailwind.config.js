/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: '#0f111a', alt: '#141622', panel: '#1e2130' },
        border: { DEFAULT: '#1e2130', hover: '#2a2e42' },
        accent: { blue: '#4facfe', cyan: '#00f2fe', green: '#64ffda', yellow: '#e2c044' },
        text: { primary: '#e2e8f0', secondary: '#8892b0', muted: '#5a627a' }
      }
    },
  },
  plugins: [],
}
