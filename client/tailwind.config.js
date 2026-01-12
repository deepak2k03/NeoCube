/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#030712", 
        surface: "#0f172a",    
        surfaceHighlight: "#1e293b", 
        primary: {
          DEFAULT: "#3b82f6", 
          glow: "#60a5fa",    
          dark: "#1d4ed8",
        },
        secondary: {
          DEFAULT: "#14b8a6", 
          glow: "#2dd4bf",
        },
        textMain: "#f8fafc",  
        textMuted: "#94a3b8", 
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}