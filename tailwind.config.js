/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.{html,js,ejs}",
    "./public/**/*.{html,js}",
    "./routes/**/*.js"
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        // Modern Primary Palette - Luxury Earth Tones
        primary: {
          50: '#FAF8F6',
          100: '#F4EDE5',
          200: '#E8DBCB',
          300: '#DCC9B1',
          400: '#D0B797',
          500: '#8B5A2B', // Main brand color
          600: '#7A4F26',
          700: '#694421',
          800: '#58391C',
          900: '#472E17',
        },
        // Accent Gold
        accent: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#D4AF37', // Luxury gold
          600: '#B59F2F',
          700: '#968027',
          800: '#77601F',
          900: '#584017',
        },
        // Neutral Grays
        neutral: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        // Success Green
        success: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          500: '#10B981',
          600: '#059669',
        },
        // Error Red
        error: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          500: '#EF4444',
          600: '#DC2626',
        },
        // Warning Yellow
        warning: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          500: '#F59E0B',
          600: '#D97706',
        },
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        grotesk: ['Space Grotesk', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-in-out',
        'fade-in-up': 'fadeInUp 0.8s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'slide-right': 'slideRight 0.4s ease-out',
        'slide-left': 'slideLeft 0.4s ease-out',
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 4s infinite',
        'scale-in': 'scaleIn 0.3s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(40px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)'
          },
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
        },
        slideDown: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(-20px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        slideRight: {
          '0%': { 
            opacity: '0',
            transform: 'translateX(-30px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateX(0)'
          },
        },
        slideLeft: {
          '0%': { 
            opacity: '0',
            transform: 'translateX(30px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateX(0)'
          },
        },
        scaleIn: {
          '0%': { 
            opacity: '0',
            transform: 'scale(0.9)'
          },
          '100%': { 
            opacity: '1',
            transform: 'scale(1)'
          },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      boxShadow: {
        'soft': '0 2px 15px rgba(0, 0, 0, 0.08)',
        'medium': '0 4px 25px rgba(0, 0, 0, 0.12)',
        'strong': '0 10px 40px rgba(0, 0, 0, 0.15)',
        'luxury': '0 20px 60px rgba(139, 90, 43, 0.15)',
        'inner-soft': 'inset 0 2px 8px rgba(0, 0, 0, 0.06)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #8B5A2B 0%, #A67C52 100%)',
        'gradient-accent': 'linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%)',
        'gradient-hero': 'linear-gradient(135deg, rgba(139, 90, 43, 0.95) 0%, rgba(166, 124, 82, 0.9) 50%, rgba(212, 175, 55, 0.85) 100%)',
        'gradient-dark': 'linear-gradient(180deg, #262626 0%, #171717 100%)',
        'gradient-light': 'linear-gradient(180deg, #FAFAFA 0%, #F5F5F5 100%)',
        'shimmer': 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
      },
      backdropBlur: {
        xs: '2px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
