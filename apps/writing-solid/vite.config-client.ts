import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// @ts-expect-error not dealing with typings
import { ssrClient } from '@marbemac/configs-vite';
import { defineConfig } from 'vite';
import { chunkSplitPlugin } from 'vite-plugin-chunk-split';
import solidPlugin from 'vite-plugin-solid';

const __dirname = dirname(fileURLToPath(import.meta.url));
const clientEntryPath = resolve(__dirname, 'src/entry-client.tsx');

const baseConfig = ssrClient({ clientEntryPath });

export default defineConfig({
  ...baseConfig,
  plugins: [
    solidPlugin({ ssr: true }),

    chunkSplitPlugin({
      customSplitting: {
        styling: ['@twind/core', '@twind/preset-tailwind', '@material/material-color-utilities'],
        primitives: ['@marbemac/ui-primitives-solid'],
        zod: ['zod'],
        editor: ['@tiptap/core', 'prosemirror-view', 'prosemirror-model', 'prosemirror-transform', 'prosemirror-state'],
      },
    }),

    ...baseConfig.plugins,
  ],
});
