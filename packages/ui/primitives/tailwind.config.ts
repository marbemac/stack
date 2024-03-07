import path from 'node:path';

import { preset } from '@marbemac/ui-styles/tailwind';
import type { Config } from 'tailwindcss';

export default {
  presets: [preset()],

  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './stories/**/*.{js,ts,jsx,tsx,mdx}',
    './.storybook/preview.tsx',

    path.join(path.dirname(require.resolve('@marbemac/ui-styles')), '**/*.ts'),
  ],
} satisfies Config;
