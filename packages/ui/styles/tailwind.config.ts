import type { Config } from 'tailwindcss';

import { preset } from './src/tailwind/index.ts';

export default {
  presets: [preset()],

  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
} satisfies Config;
