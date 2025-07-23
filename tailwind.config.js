module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
     extend: {
    colors: {
      parchment: '#f4f1ea',
      ink: '#4b3f2f',
      antique: '#c2b280',
    },
    fontFamily: {
      heading: ['"Cinzel"', 'serif'],
      body: ['"Merriweather"', 'serif'],
    },
    animation: {
        fadeIn: 'fadeIn 1s ease-out forwards',
        'spin-slow': 'spin 2.5s linear infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        }
      }
  },
  },
  plugins: [],
}