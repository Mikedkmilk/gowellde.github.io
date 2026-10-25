/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography';

// 配色沿用旧站与品牌指南：工业蓝 + 安全橙 + 碳黑
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#F57C00',
          dark: '#1A1A1A',
          gray: '#333333',
          light: '#F8F9FA',
          blue: '#0056b3',
        },
      },
      fontFamily: {
        sans: ['Roboto', 'system-ui', 'sans-serif'],
        mono: ['Roboto Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [typography],
};
