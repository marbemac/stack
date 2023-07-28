// @ts-expect-error not dealing with typings
import { ssrServer } from '@marbemac/configs-vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const baseConfig = ssrServer();

export default defineConfig({
  ...baseConfig,

  plugins: [react(), ...baseConfig.plugins],

  ssr: {
    ...baseConfig.ssr,

    // because of this issue -> https://github.com/facebook/react/issues/26906
    noExternal: ['react-dom'],
  },
});
