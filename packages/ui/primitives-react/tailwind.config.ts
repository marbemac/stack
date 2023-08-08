import path from 'node:path';

import { themeObj } from '@marbemac/ui-styles/tailwind-theme';
import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './.storybook/preview.tsx',

    path.join(path.dirname(require.resolve('@marbemac/ui-styles')), '**/*.ts'),
  ],

  theme: themeObj,

  plugins: [],
} satisfies Config;
