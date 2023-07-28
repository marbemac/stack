// @ts-expect-error not dealing with typings
import { ssrDev } from '@marbemac/configs-vite';
import devtools from 'solid-devtools/vite';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

const baseConfig = ssrDev();

// https://vitejs.dev/config/
export default defineConfig({
  ...baseConfig,

  plugins: [
    // https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#2-install-the-debugger-library
    devtools({
      autoname: true,
      // locator: {
      //   targetIDE: 'vscode',
      //   componentLocation: true,
      //   jsxLocation: true,
      // },
    }),

    solidPlugin({ ssr: true }),

    ...baseConfig.plugins,
  ],
});
