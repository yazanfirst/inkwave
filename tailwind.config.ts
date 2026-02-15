import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#06070d',
        neon: '#8f00ff'
      },
      backgroundImage: {
        'inkwave-gradient': 'linear-gradient(115deg,#ff2f6d 0%,#ff8a00 25%,#ffd400 45%,#37d67a 65%,#00c2ff 82%,#8f00ff 100%)'
      },
      boxShadow: {
        glow: '0 0 40px rgba(143,0,255,.35)'
      }
    }
  },
  plugins: []
} satisfies Config;
