/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    container: {
      center: true
    },
    extend: {
      screens: {
        xs: '480px',
        xxs: '380px',
        xxxs: '320px',
      },
      colors: {
        background: {
          DEFAULT: 'var(--background)',
          elevated: 'var(--background-elevated)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        muted: 'var(--muted)',
        border: 'var(--border)',
        'blue-logo': 'var(--blue-logo)',
        'purple-logo': 'var(--purple-logo)',
      },
      fontFamily: {
        sans: ['Outfit Variable', ...defaultTheme.fontFamily.sans],
      },
      animation: {
        'zoom-in': 'zoom-in 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
        'zoom-out': 'zoom-out 0.2s cubic-bezier(0.32, 0.72, 0, 1)',
      },
      keyframes: {
        'zoom-in': {
          from: {
            transform: 'scale(0.95)',
          },
          to: {
            transform: 'scale(1)',
          }
        },
        'zoom-out': {
          from: {
            transform: 'scale(1)',
            opacity: 1,
          },
          to: {
            transform: 'scale(0.95)',
            opacity: 0,
          }
        },
      }
    },
  },
  plugins: [],
}

