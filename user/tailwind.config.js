/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.{html,js,ejs}",
    "./public/**/*.{html,js}",
    "./routes/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FEFCF8',
          100: '#F4E4BC',
          200: '#E8C896',
          300: '#DCAC70',
          400: '#D0904A',
          500: '#8B5A2B',
          600: '#7A4F26',
          700: '#694421',
          800: '#58391C',
          900: '#472E17',
        },
        secondary: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#D4AF37',
          600: '#B59F2F',
          700: '#968F27',
          800: '#777F1F',
          900: '#586F17',
        },
        accent: {
          50: '#FEFCF8',
          100: '#F4E4BC',
          200: '#E8C896',
          300: '#DCAC70',
          400: '#D0904A',
          500: '#8B5A2B',
        }
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(30px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)'
          },
        }
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(139, 90, 43, 0.1)',
        'medium': '0 8px 30px rgba(139, 90, 43, 0.15)',
        'strong': '0 12px 40px rgba(139, 90, 43, 0.2)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #8B5A2B 0%, #A67C52 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%)',
        'gradient-hero': 'linear-gradient(135deg, #8B5A2B 0%, #A67C52 50%, #D4AF37 100%)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
