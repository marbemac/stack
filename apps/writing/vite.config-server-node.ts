// @ts-expect-error not dealing with typings
import { ssrServer } from '@marbemac/configs-vite';
import { defineConfig } from 'vite';

export default defineConfig({
  ...ssrServer(),
});
