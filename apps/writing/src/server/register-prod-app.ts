import type { TrpcRouter } from '@libs/internal-api';
import { trpcRouter } from '@libs/internal-api';
import { TRPC_ROOT_PATH } from '@libs/internal-api/consts';
import { registerAppHandler } from '@marbemac/server-ssr/server';
import type { JSXElement } from 'solid-js';
import { renderToStream } from 'solid-js/web';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore added at build time
import manifest from '../../dist/manifest.json';
import { render, tw } from './entry-server.tsx';
import { globalMiddleware } from './middleware.js';
import { trpcContextFactory } from './trpc-context-factory.js';
import type { AppPageEvent, HonoApp, HonoEnv } from './types.js';

export const registerProdApp = ({ app }: { app: HonoApp }) => {
  const env: Env = { manifest };

  registerAppHandler<HonoEnv, TrpcRouter, AppPageEvent, JSXElement>({
    app,
    render,
    tw,
    env,
    globalMiddlware: globalMiddleware(),
    trpcRouter,
    trpcRootPath: TRPC_ROOT_PATH,
    trpcContextFactory,
    renderToStream: async ({ writable, render, pageEvent }) => {
      renderToStream(() => render({ event: pageEvent })).pipeTo(writable);
    },
  });

  app.onError((err, c) => {
    console.error(`${err}`);
    return c.text('An unknown error occurred.', 500);
  });
};
