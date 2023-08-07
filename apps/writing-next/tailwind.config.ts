import path from 'node:path';

import { themeObj } from '@marbemac/ui-styles/tailwind-theme';
import type { Config } from 'tailwindcss';

export default {
  plugins: [],

  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',

    path.join(path.dirname(require.resolve('@marbemac/ui-styles')), '**/*.ts'),
  ],

  theme: themeObj,
} satisfies Config;
