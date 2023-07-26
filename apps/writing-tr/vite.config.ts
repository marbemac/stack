// @ts-expect-error not dealing with typings
import { ssrDev } from '@marbemac/configs-vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const baseConfig = ssrDev();

// https://vitejs.dev/config/
export default defineConfig({
  ...baseConfig,
  plugins: [react(), ...baseConfig.plugins],

  resolve: {
    // because of this issue -> https://github.com/facebook/react/issues/26906
    conditions: ['worker'],

    ...baseConfig.resolve,
  },
});
