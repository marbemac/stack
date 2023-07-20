import analyze from 'rollup-plugin-analyzer';
import { defineConfig } from 'vite';
import { chunkSplitPlugin } from 'vite-plugin-chunk-split';
import solidPlugin from 'vite-plugin-solid';

export const ssrClient = ({ clientEntryPath }) => {
  return defineConfig({
    define: { 'process.env.NODE_ENV': '"production"' },

    plugins: [
      solidPlugin({ ssr: true }),
      chunkSplitPlugin({
        customSplitting: {
          styling: ['@twind/core', '@twind/preset-tailwind', '@material/material-color-utilities'],
          primitives: ['@marbemac/ui-primitives'],
          zod: ['zod'],
          editor: [
            '@tiptap/core',
            'prosemirror-view',
            'prosemirror-model',
            'prosemirror-transform',
            'prosemirror-state',
          ],
          // charts: ['@marbemac/ui-charts'],
        },
      }),
    ],

    build: {
      manifest: true,
      chunkSizeWarningLimit: 750,
      rollupOptions: {
        input: clientEntryPath,
        plugins: [
          analyze({
            summaryOnly: true,
            limit: 15,
          }),
        ],
      },
    },

    resolve: {
      alias: {
        '~': `${process.cwd()}/src`,
      },
    },
  });
};
