import type { TrpcRouter } from '@libs/internal-api';
import { trpcRouter } from '@libs/internal-api';
import { TRPC_ROOT_PATH } from '@libs/internal-api/consts';
import { registerAppHandler } from '@marbemac/server-ssr';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore added at build time
import manifest from '../../dist/manifest.json';
import { render, tw } from '../entry-server.tsx';
import { createReqContext } from './create-req-context.ts';
import { renderToStream } from './render-to-stream.ts';
import type { AppPageEvent, HonoApp, HonoEnv, ServerEntry } from './types.js';

export const registerProdApp = ({ app }: { app: HonoApp }) => {
  const env: Env = { manifest };

  registerAppHandler<HonoEnv, TrpcRouter, AppPageEvent, ServerEntry>({
    app,
    env,
    trpcRouter,
    trpcRootPath: TRPC_ROOT_PATH,
    renderToStream,
    createReqContext,
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
