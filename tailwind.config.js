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
        ios: {
          bg: '#000000',
          card: '#1C1C1E',
          cardHover: '#2C2C2E',
          border: 'rgba(255, 255, 255, 0.12)',
          blue: '#0A84FF',
          green: '#30D158',
          cyan: '#64D2FF',
          indigo: '#5E5CE6',
          purple: '#BF5AF2',
          pink: '#FF375F',
          yellow: '#FFD60A',
          orange: '#FF9F0A',
          red: '#FF453A',
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Text"', '"SF Pro Display"', '"Helvetica Neue"', 'sans-serif'],
      },
      boxShadow: {
        ios: '0 8px 32px rgba(0, 0, 0, 0.4)',
        'ios-glow': '0 0 20px rgba(10, 132, 255, 0.3)',
        'ios-green': '0 0 20px rgba(48, 209, 88, 0.3)',
      }
    },
  },
  plugins: [],
}
