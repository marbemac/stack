import { defineConfig } from 'vite';

export const ssrDev = () => {
  return defineConfig({
    plugins: [],

    resolve: {
      alias: {
        '~': `${process.cwd()}/src`,
      },
    },
  });
};
