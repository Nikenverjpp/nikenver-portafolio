/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0A0A0F',
          secondary: '#111118',
          elevated: '#1A1A26',
        },
        text: {
          primary: '#F0F0FF',
          secondary: '#9B9BB8',
          muted: '#5A5A78',
        },
        accent: {
          cyan: '#00D9FF',
          amber: '#F59E0B',
          violet: '#818CF8',
        },
        border: {
          DEFAULT: '#2A2A3F',
          active: '#00D9FF40',
        },
      },
      fontFamily: {
        display: ['Syne', 'system-ui', 'sans-serif'],
        sans: ['IBM Plex Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 40px #00D9FF26',
      },
    },
  },
  plugins: [],
};
