/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Primary: deep teal - calm, trustworthy, used for actions and the AI assistant.
        brand: {
          50: '#effcf9', 100: '#d3f8f0', 200: '#a8f0e2', 300: '#72e0cf', 400: '#3ac8b7',
          500: '#1fad9f', 600: '#148a82', 700: '#146e69', 800: '#155856', 900: '#164847',
        },
        // Accent: saffron - deals, discounts and the "negotiate" call to action.
        accent: {
          50: '#fff8eb', 100: '#ffeccb', 200: '#ffd78f', 300: '#ffbc52', 400: '#ffa11f',
          500: '#f68008', 600: '#da5f04', 700: '#b44308',
        },
        // Neutrals with a slight blue-green cast so the page never looks flat grey.
        ink: {
          50: '#f6f8fa', 100: '#eaeef2', 200: '#d5dde4', 300: '#b3bfca', 400: '#8797a6',
          500: '#627385', 600: '#4b5a6b', 700: '#3b4857', 800: '#26313d', 900: '#131c26', 950: '#0b1219',
        },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(19,28,38,.04), 0 2px 8px rgba(19,28,38,.05)',
        lift: '0 10px 30px -8px rgba(19,28,38,.18)',
        brand: '0 8px 22px -6px rgba(20,138,130,.45)',
        accent: '0 8px 22px -6px rgba(246,128,8,.45)',
      },
      borderRadius: { xl2: '1.25rem', xl3: '1.75rem' },
      keyframes: {
        rise: { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        pop: { '0%': { transform: 'scale(.96)', opacity: 0 }, '100%': { transform: 'scale(1)', opacity: 1 } },
        dots: { '0%,80%,100%': { opacity: 0.25, transform: 'translateY(0)' }, '40%': { opacity: 1, transform: 'translateY(-3px)' } },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
      },
      animation: {
        rise: 'rise .35s ease-out both',
        pop: 'pop .2s ease-out both',
        dots: 'dots 1.2s infinite ease-in-out',
      },
    },
  },
  plugins: [],
}
