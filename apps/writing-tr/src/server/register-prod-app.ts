import type { TrpcRouter } from '@libs/internal-api';
import { trpcRouter } from '@libs/internal-api';
import { TRPC_ROOT_PATH } from '@libs/internal-api/consts';
import { registerAppHandler } from '@marbemac/server-ssr/server';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore added at build time
import manifest from '../../dist/manifest.json';
import { render, tw } from './entry-server.tsx';
import { globalMiddleware } from './middleware.js';
import { createRenderToStreamFn } from './render-to-stream.ts';
import { trpcContextFactory } from './trpc-context-factory.js';
import type { AppPageEvent, HonoApp, HonoEnv, ServerEntry } from './types.js';

export const registerProdApp = ({ app }: { app: HonoApp }) => {
  const env: Env = { manifest };

  registerAppHandler<HonoEnv, TrpcRouter, AppPageEvent, ServerEntry>({
    app,
    env,
    globalMiddlware: globalMiddleware(),
    trpcRouter,
    trpcRootPath: TRPC_ROOT_PATH,
    trpcContextFactory,
    renderToStream: createRenderToStreamFn({
      streamOptions: {
        bootstrapModules: [manifest['src/entry-client.tsx']['file']],
      },
    }),
    serverEntry: {
      render,
      tw,
    },
  });

  app.onError((err, c) => {
    console.error(`${err}`);
    return c.text('An unknown error occurred.', 500);
  });
};
