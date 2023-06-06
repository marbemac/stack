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
          styling: ['@twind/core', '@twind/preset-tailwind'],
          primitives: ['@shared/ui-primitives'],
          charts: ['@shared/ui-charts'],
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
  });
};
