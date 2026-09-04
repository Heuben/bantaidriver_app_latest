export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ios: {
          canvas: '#F2F2F7',
          grouped: '#FFFFFF',
          canvasDark: '#000000',
          groupedDark: '#1C1C1E',
          separator: 'rgba(60,60,67,0.29)',
          separatorDark: 'rgba(84,84,88,0.65)',
          label2: 'rgba(60,60,67,0.60)',
          label2Dark: 'rgba(235,235,245,0.60)',
          fill: 'rgba(120,120,128,0.12)',
          fillDark: 'rgba(120,120,128,0.32)',
        },
        safe: {
          DEFAULT: '#34C759',
          glow: 'rgba(52, 199, 89, 0.45)',
        },
        emergency: {
          DEFAULT: '#FF3B30',
          glow: 'rgba(255, 59, 48, 0.45)',
        },
        warning: {
          DEFAULT: '#FF9F0A',
          glow: 'rgba(255, 159, 10, 0.45)',
        },
        accent: {
          DEFAULT: '#0A84FF',
          glow: 'rgba(10, 132, 255, 0.45)',
        },
      },
      fontFamily: {
        sf: [
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Display',
          'SF Pro Text',
          'Inter',
          'Segoe UI',
          'sans-serif',
        ],
      },
      borderRadius: {
        ios: '16px',
        '2xl': '20px',
        '3xl': '28px',
      },
      transitionTimingFunction: {
        ios: 'cubic-bezier(0.23, 1, 0.32, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.04), 0 2px 8px 0 rgba(0, 0, 0, 0.02)',
        'glass-lg': '0 12px 40px 0 rgba(0, 0, 0, 0.06), 0 4px 12px 0 rgba(0, 0, 0, 0.03)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.45), 0 2px 8px 0 rgba(0, 0, 0, 0.25)',
        'glass-dark-lg': '0 12px 40px 0 rgba(0, 0, 0, 0.55), 0 4px 12px 0 rgba(0, 0, 0, 0.35)',
        'safe-glow': '0 0 0 1px rgba(52, 199, 89, 0.18), 0 8px 24px -8px rgba(52, 199, 89, 0.35)',
        'emergency-glow': '0 0 0 1px rgba(255, 59, 48, 0.18), 0 8px 24px -8px rgba(255, 59, 48, 0.45)',
        'warning-glow': '0 0 0 1px rgba(255, 159, 10, 0.20), 0 8px 24px -8px rgba(255, 159, 10, 0.45)',
        'accent-glow': '0 0 0 1px rgba(10, 132, 255, 0.18), 0 8px 24px -8px rgba(10, 132, 255, 0.40)',
      },
      backdropBlur: {
        glass: '20px',
        'glass-lg': '32px',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.15)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.8)', opacity: '0.7' },
          '100%': { transform: 'scale(2.4)', opacity: '0' },
        },
        'aurora': {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '33%': { transform: 'translate(2%, -2%) rotate(1deg)' },
          '66%': { transform: 'translate(-1%, 1%) rotate(-1deg)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 2.4s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.16, 1, 0.3, 1) infinite',
        'aurora': 'aurora 24s ease-in-out infinite',
        'shimmer': 'shimmer 2.4s linear infinite',
      },
    },
  },
  plugins: [],
};
