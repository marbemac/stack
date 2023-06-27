import type { Config } from 'tailwindcss';

import { themeObj } from './theme.ts';

/**
 * This is used to generate the root `tailwind.config.js` file.
 *
 * Make changes here, NOT in the compiled `tailwind.config.js` file. Then run `yarn workspace {this workspace} codegen`
 */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: themeObj,
} satisfies Config;
