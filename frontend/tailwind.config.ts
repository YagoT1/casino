import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        casino: {
          bg: '#0a0f1f',
          card: '#121b34',
          accent: '#f5a524',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
