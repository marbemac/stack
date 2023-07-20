import type { TrpcRouter } from '@libs/internal-api';
import { trpcRouter } from '@libs/internal-api';
import { TRPC_ROOT_PATH } from '@libs/internal-api/consts';
import { createDevServer } from '@marbemac/server-ssr/create-dev-server';
import type { JSX } from 'solid-js';
import { renderToStream } from 'solid-js/web';

import { ENV_VARIABLES_LIST } from './env.js';
import { globalMiddleware } from './middleware.js';
import { trpcContextFactory } from './trpc-context-factory.js';
import type { AppPageEvent, HonoEnv } from './types.js';

const port = Number(process.env['PORT'] || 3016);

const { viteDevServer, server } = await createDevServer<HonoEnv, TrpcRouter, AppPageEvent, JSX.Element>({
  entryServerPath: './src/server/entry-server.tsx',
  hmrPort: 3026,
  globalMiddlware: globalMiddleware(),
  envVariablesList: ENV_VARIABLES_LIST,
  trpcRootPath: TRPC_ROOT_PATH,
  trpcRouter,
  trpcContextFactory,
  renderToStream: async ({ writable, render, pageEvent }) => {
    renderToStream(() => render({ event: pageEvent })).pipeTo(writable);
  },
});

server.listen(port, () => {
  console.log(`🚀 Server started on port ${port}`);
});

if (import.meta.hot) {
  import.meta.hot.on('vite:beforeFullReload', () => {
    server.close();
    return viteDevServer.close();
  });
}
