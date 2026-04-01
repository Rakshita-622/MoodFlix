/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        yellow: '#ffe17c',
        charcoal: '#171e19',
        sage: '#b7c6c2',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Satoshi"', 'sans-serif'],
      },
      boxShadow: {
        'brutal-sm': '4px 4px 0px 0px #000000',
        'brutal-lg': '8px 8px 0px 0px #000000',
        'brutal-xl': '12px 12px 0px 0px #000000',
      },
      borderRadius: {
        brutal: '12px',
      },
    },
  },
  plugins: [],
};
