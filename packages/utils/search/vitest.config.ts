/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  plugins: [],
  build: {
    target: 'esnext',
  },
});
