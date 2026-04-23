/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif'
        ]
      },
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#dae6ff',
          200: '#bcd1ff',
          300: '#8eb1ff',
          400: '#5b87ff',
          500: '#3661ff',
          600: '#1f43f0',
          700: '#1a35c4',
          800: '#1b30a0',
          900: '#1c2f7e'
        },
        ink: {
          900: '#0b1220',
          700: '#1f2937',
          500: '#4b5563',
          300: '#9ca3af'
        }
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(31, 67, 240, 0.25)',
        card: '0 1px 2px rgba(16,24,40,.06), 0 8px 24px -8px rgba(16,24,40,.10)'
      },
      borderRadius: {
        xl: '14px',
        '2xl': '20px'
      },
      backgroundImage: {
        'hero-gradient':
          'radial-gradient(1200px 600px at 10% -10%, rgba(54,97,255,0.18), transparent 60%), radial-gradient(800px 400px at 90% 0%, rgba(124,58,237,0.18), transparent 60%)'
      }
    }
  },
  plugins: []
};
