import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter var"', 'Inter', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        primary: {
          50: '#f3f0ff',
          100: '#e4ddff',
          200: '#c7baff',
          300: '#a08bff',
          400: '#7b5eff',
          500: '#603ce6',
          600: '#4a2fba',
          700: '#37248c',
          800: '#23185a',
          900: '#120c2f',
        },
        accent: '#fbbf24',
        surface: '#f9fafb',
        muted: '#6b7280',
      },
      boxShadow: {
        card: '0 10px 30px -15px rgba(24, 34, 87, 0.35)',
      },
    },
  },
  plugins: [forms, typography],
};

