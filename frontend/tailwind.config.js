/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff1f0',
          100: '#ffe2df',
          200: '#ffc9c4',
          300: '#ffa099',
          400: '#ff6b61',
          500: '#ff3d33',
          600: '#e8261b',
          700: '#c41c12',
          800: '#a21a12',
          900: '#861c16',
        },
        brand: '#E8261B',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 16px rgba(0,0,0,0.1)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.16)',
        'nav': '0 1px 0 rgba(0,0,0,0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { transform: 'translateY(20px)', opacity: 0 }, to: { transform: 'translateY(0)', opacity: 1 } }
      }
    }
  },
  plugins: []
}
