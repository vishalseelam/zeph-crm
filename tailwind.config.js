/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Zeph Brand Colors
        brand: {
          primary: '#265242',      // Forest green - main brand color
          background: '#fcfaf2',   
          accent: '#D6FF33',       // Lime accent
          'primary-dark': '#1a3a2e',
          'primary-light': '#3a7a64',
        },
        // Keep primary as brand primary for consistency
        primary: {
          50: '#f0f9f5',
          100: '#d9f2e8',
          200: '#b3e5d1',
          300: '#7dd1b0',
          400: '#4ab88d',
          500: '#3a9e77',
          600: '#265242',  
          700: '#1f4336',
          800: '#1a3a2e',
          900: '#142e24',
        },
        // Corporate grays (keep for UI elements)
        corporate: {
          50: '#fcfaf2',   
          100: '#f5f3eb',
          200: '#e8e6dd',
          300: '#d4d2c8',
          400: '#a8a69c',
          500: '#7c7a70',
          600: '#5c5a52',
          700: '#3d3b35',
          800: '#2a2822',
          900: '#1a1814',
        }
      },
    },
  },
  plugins: [],
}


