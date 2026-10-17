/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Primary: deep teal - calm, trustworthy, used for actions and the AI assistant.
        brand: {
          50: '#fff3ec', 100: '#ffe3d2', 200: '#ffc6a3', 300: '#ff9f68', 400: '#ff7633',
          500: '#f2561a', 600: '#d93a0b', 700: '#b02d0c', 800: '#8c2610', 900: '#72220f',
        },
        // Accent: saffron - deals, discounts and the "negotiate" call to action.
        accent: {
          50: '#fffbea', 100: '#fff1c2', 200: '#ffe18a', 300: '#ffcc4d', 400: '#ffb81f',
          500: '#f59e0b', 600: '#d97706', 700: '#b45309',
        },
        // Neutrals with a slight blue-green cast so the page never looks flat grey.
        ink: {
          50: '#faf7f5', 100: '#f3ede8', 200: '#e6dcd4', 300: '#cfc1b6', 400: '#a39284',
          500: '#7c6c60', 600: '#5e5047', 700: '#463a33', 800: '#2e2520', 900: '#1c1613', 950: '#100c0a',
        },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(19,28,38,.04), 0 2px 8px rgba(19,28,38,.05)',
        lift: '0 10px 30px -8px rgba(19,28,38,.18)',
        brand: '0 8px 22px -6px rgba(217,58,11,.42)',
        accent: '0 8px 22px -6px rgba(245,158,11,.5)',
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
