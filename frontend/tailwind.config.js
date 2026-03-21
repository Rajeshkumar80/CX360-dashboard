/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          900: '#0a0a0a',
          800: '#111111',
          700: '#1a1a1a',
          600: '#1c1c1c',
          500: '#2a2a2a',
          400: '#333333',
          300: '#444444',
        },
        accent: {
          DEFAULT: '#ff6600',
          light: '#ff8c00',
          dark: '#e55a00',
          muted: 'rgba(255, 102, 0, 0.15)',
        },
        text: {
          primary: '#ffffff',
          secondary: '#999999',
          muted: '#666666',
        },
        status: {
          success: '#22c55e',
          warning: '#eab308',
          danger: '#ef4444',
          info: '#3b82f6',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
