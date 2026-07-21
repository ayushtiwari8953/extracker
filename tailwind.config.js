/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Sora', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#d9e6ff',
          200: '#bcd3ff',
          300: '#8eb6ff',
          400: '#598dff',
          500: '#3366ff',
          600: '#1f47f5',
          700: '#1735e1',
          800: '#192eb6',
          900: '#1a2d8f',
          950: '#151d57',
        },
        ink: {
          50: '#f7f8fa',
          100: '#eef0f4',
          200: '#dde1e9',
          300: '#c2c8d4',
          400: '#9aa1b3',
          500: '#6e7587',
          600: '#525968',
          700: '#3f4552',
          800: '#2a2e38',
          900: '#1a1d24',
          950: '#101218',
        },
      },
      boxShadow: {
        soft: '0 1px 2px rgba(16,18,24,0.04), 0 4px 16px rgba(16,18,24,0.06)',
        card: '0 1px 3px rgba(16,18,24,0.05), 0 12px 32px -12px rgba(16,18,24,0.12)',
        glow: '0 0 0 1px rgba(51,102,255,0.18), 0 8px 30px -8px rgba(51,102,255,0.35)',
      },
      backgroundImage: {
        'grid-light':
          'linear-gradient(to right, rgba(16,18,24,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(16,18,24,0.04) 1px, transparent 1px)',
        'grid-dark':
          'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out both',
        'scale-in': 'scale-in 0.2s ease-out both',
      },
    },
  },
  plugins: [],
};
