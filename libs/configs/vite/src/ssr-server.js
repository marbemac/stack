import analyze from 'rollup-plugin-analyzer';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import solidPlugin from 'vite-plugin-solid';

export const ssrServer = () => {
  return defineConfig({
    define: { 'process.env.NODE_ENV': '"production"' },

    plugins: [
      solidPlugin({ ssr: true }),

      // Can help with debugging - prefer patching libs to leverage standards based options rather than polyfill
      // nodePolyfills({
      //   // Whether to polyfill `node:` protocol imports.
      //   protocolImports: true,
      // }),
    ],

    ssr: {
      noExternal: true,
    },

    resolve: {
      /**
       * When building for cloudflare, prefer workerd imports (example in shared/db/pg-client/package.json)
       *
       * Some packages (like @panva/hkdf) use "worker" as the export condition.
       *
       * The only package that needs browser (for crypto) is @noble/hashes.. we could fork
       */
      conditions: ['workerd', 'worker', 'browser'],
    },

    build: {
      emptyOutDir: false,
      sourcemap: true,
      rollupOptions: {
        /**
         * This is a cloudflare thing (if using workers rather than pages).
         * Try commenting this out and building.. you'll see.
         */
        // external: ['__STATIC_CONTENT_MANIFEST'],

        output: {
          // Required for edge runtimes - dynamic imports not allowed (which is fine.. this is on the server)
          inlineDynamicImports: true,
        },

        plugins: [
          analyze({
            summaryOnly: true,
            limit: 15,
          }),
        ],
      },
    },
  });
};
