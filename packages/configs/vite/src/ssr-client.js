import analyze from 'rollup-plugin-analyzer';
import { defineConfig } from 'vite';

export const ssrClient = ({ clientEntryPath }) => {
  return defineConfig({
    define: { 'process.env.NODE_ENV': '"production"' },

    plugins: [],

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
