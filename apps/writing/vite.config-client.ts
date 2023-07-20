import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// @ts-expect-error not dealing with typings
import { ssrClient } from '@marbemac/configs-vite';
import { defineConfig } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));
const clientEntryPath = resolve(__dirname, 'src/entry-client.tsx');

export default defineConfig({
  ...ssrClient({ clientEntryPath }),
});
