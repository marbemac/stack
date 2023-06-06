import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import devtools from 'solid-devtools/vite';

export const ssrDev = () => {
  return defineConfig({
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
    ],
  });
};
