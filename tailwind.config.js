/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0D0E0F',
        'background-secondary': '#151617',
        surface: '#1B1C1E',
        'surface-hover': '#232426',
        'surface-elevated': '#28292B',
        border: '#383A3D',
        'text-primary': '#F2F0EB',
        'text-secondary': '#A8A7A3',
        'text-muted': '#73736F',
        accent: '#D6A85F',
        'accent-hover': '#E2BA73',
        'accent-dark': '#8F6B36',
        'accent-surface': '#28231A',
        positive: '#A8B89A',
        'cta-text': '#11100E',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        small: '6px',
        input: '8px',
        button: '8px',
        card: '10px',
        modal: '12px',
      },
      boxShadow: {
        subtle: '0 4px 20px rgba(0, 0, 0, 0.40)',
        'card-hover': '0 12px 36px rgba(0, 0, 0, 0.60)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out forwards',
        'shimmer': 'shimmer 1.8s infinite ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
