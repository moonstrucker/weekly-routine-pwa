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
          bg: '#F2F2F7',
          card: '#FFFFFF',
          cardHover: '#F8FAFC',
          border: 'rgba(0, 0, 0, 0.08)',
          blue: '#007AFF',
          green: '#34C759',
          cyan: '#32ADE6',
          indigo: '#5856D6',
          purple: '#AF52DE',
          pink: '#FF2D55',
          yellow: '#FFCC00',
          orange: '#FF9500',
          red: '#FF3B30',
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Text"', '"SF Pro Display"', '"Helvetica Neue"', 'sans-serif'],
      },
      boxShadow: {
        ios: '0 4px 20px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.03)',
        'ios-glow': '0 4px 16px rgba(0, 122, 255, 0.25)',
        'ios-green': '0 4px 16px rgba(52, 199, 89, 0.25)',
      }
    },
  },
  plugins: [],
}
