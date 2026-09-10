/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        // Football Manager 26 signature palette: Vibrant Indigo/Purple, luminous cards, vivid neon accents
        background: '#110b22',
        surface: '#1b1335',
        surfaceHighlight: '#261b47',
        surfaceCard: '#1f163d',
        primary: '#8b5cf6', // FM26 Electric Violet
        secondary: '#06b6d4', // FM26 Electric Cyan
        accent: '#10b981', // Matchday Pitch Mint Green
        fm: {
          bg: '#110b22',
          surface: '#1b1335',
          card: '#211742',
          cardHover: '#2b1f54',
          border: 'rgba(167, 139, 250, 0.18)',
          purple: '#7c3aed',
          violet: '#8b5cf6',
          violetLight: '#a78bfa',
          cyan: '#06b6d4',
          neon: '#00f5a0',
          emerald: '#10b981',
          gold: '#f59e0b',
        }
      },
      boxShadow: {
        'fm-glow': '0 0 25px -5px rgba(139, 92, 246, 0.35)',
        'fm-card': '0 4px 20px -2px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(167, 139, 250, 0.12)',
        'fm-card-hover': '0 12px 30px -4px rgba(124, 58, 237, 0.3), 0 0 0 1px rgba(167, 139, 250, 0.35)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}