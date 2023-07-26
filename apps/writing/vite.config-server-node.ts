// @ts-expect-error not dealing with typings
import { ssrServer } from '@marbemac/configs-vite';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

const baseConfig = ssrServer();

export default defineConfig({
  ...baseConfig,

  plugins: [solidPlugin({ ssr: true }), ...baseConfig.plugins],

  ssr: {
    ...baseConfig.ssr,
    noExternal: true,
  },
});
