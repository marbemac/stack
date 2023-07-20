// @ts-expect-error not dealing with typings
import { ssrDev } from '@marbemac/configs-vite';
import { defineConfig } from 'vite';

const base = ssrDev();

export default defineConfig({
  ...base,
});
