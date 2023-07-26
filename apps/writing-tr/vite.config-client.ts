import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// @ts-expect-error not dealing with typings
import { ssrClient } from '@marbemac/configs-vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));
const clientEntryPath = resolve(__dirname, 'src/entry-client.tsx');

const baseConfig = ssrClient({ clientEntryPath });

export default defineConfig({
  ...baseConfig,
  plugins: [react(), ...baseConfig.plugins],
});
