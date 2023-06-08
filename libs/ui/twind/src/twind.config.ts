import { themeObj } from '@marbemac/ui-styles';
import { defineConfig } from '@twind/core';
import presetLineClamp from '@twind/preset-line-clamp';
import presetTailwind from '@twind/preset-tailwind/base';

import { preflight } from './preflight.ts';

export const twindConfig = defineConfig({
  presets: [presetTailwind({ disablePreflight: true }), presetLineClamp()],

  variants: [['dark', '[data-theme="dark"] &']],

  preflight: [
    // @ts-expect-error tricky typing
    preflight,
  ],

  theme: themeObj,
});
