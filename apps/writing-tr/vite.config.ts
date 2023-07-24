import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import type { UserConfig } from 'vitest/config';

const test = {
  globals: true,
  environment: 'jsdom',
  setupFiles: ['src/__tests__/setupTests.ts'],
  threads: false,
  watch: false,
} as UserConfig['test'];

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { port: 3000 },
  build: {
    minify: false,
  },
  test,
  resolve: {
    /**
     * When building for cloudflare, prefer workerd imports (example in shared/db/pg-client/package.json)
     *
     * Some packages (like @panva/hkdf) use "worker" as the export condition.
     *
     * The only package that needs browser (for crypto) is @noble/hashes.. we could fork
     */
    conditions: ['workerd', 'worker', 'browser'],

    alias: {
      '~': `${process.cwd()}/src`,
    },
  },
});
