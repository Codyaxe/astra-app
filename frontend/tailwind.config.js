/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#6366f1',
          primaryHover: '#4f46e5',
          background: '#0f172a',
          surface: '#1e293b',
          border: '#334155',
        },
      },
    },
  },
  plugins: [],
};
