import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

import { plugin, type PluginOptions } from './plugin.ts';
import { prosePlugin } from './prose.ts';

type PresetOptions = PluginOptions;

export const preset = (options: PresetOptions = {}): Config => {
  return {
    content: [],
    plugins: [plugin(options), animate, prosePlugin({})],
  };
};
