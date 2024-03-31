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
    },
  },
  plugins: [],
}

