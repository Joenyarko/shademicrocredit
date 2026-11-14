/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./*.js"
  ],
  theme: {
    extend: {
      colors: {
        shade: {
          teal: '#008083',
          dark: '#004d4f',
          darker: '#003032',
          mint: '#01a793',
          emerald: '#02c39a',
          light: '#f4faf8',
          tint: '#e8f5f3',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'sharp': '4px 4px 0px 0px rgba(0, 48, 50, 1)',
        'sharp-teal': '4px 4px 0px 0px #008083',
        'sharp-mint': '4px 4px 0px 0px #01a793',
        'card': '0 4px 20px -2px rgba(0, 40, 40, 0.05), 0 0 0 1px rgba(0, 128, 131, 0.08)',
        'card-hover': '0 12px 30px -4px rgba(0, 80, 80, 0.12), 0 0 0 1.5px #008083',
      }
    },
  },
  plugins: [],
}

