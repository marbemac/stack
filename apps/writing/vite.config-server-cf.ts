// @ts-expect-error not dealing with typings
import { ssrServer } from '@marbemac/configs-vite';
import { defineConfig } from 'vite';

const base = ssrServer();

export default defineConfig({
  ...base,

  ssr: {
    noExternal: true,
    ...base.ssr,
  },
});
