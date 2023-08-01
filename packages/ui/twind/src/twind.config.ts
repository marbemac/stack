import { themeObj } from '@marbemac/ui-styles/tailwind-theme';
import { defineConfig } from '@twind/core';
import presetLineClamp from '@twind/preset-line-clamp';
import presetTailwind from '@twind/preset-tailwind/base';

import { preflight } from './preflight.ts';

export const twindConfig = defineConfig({
  presets: [presetTailwind({ disablePreflight: true }), presetLineClamp()],

  variants: [['dark', '[data-theme="dark"] &']],

  preflight: [preflight],

  theme: themeObj,

  // hash(className, defaultHash) {
  //   if (/^[~@]\(/.test(className)) {
  //     // a shortcut like `~(...)`
  //     // an apply like `@(...)`
  //     return defaultHash(className);
  //   }

  //   return className;
  // },

  // rules: [
  //   ['btn-', ({ $$ }) => `@(bg-${$$}-400 text-${$$}-100 py-2 px-4 rounded-lg)`],
  // ]
});
