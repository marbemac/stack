import type { Config } from 'tailwindcss';

import { themeObj } from './src/theme.ts';

export default {
  plugins: [],

  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],

  theme: themeObj,
} satisfies Config;
