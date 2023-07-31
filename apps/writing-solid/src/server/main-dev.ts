import type { TrpcRouter } from '@libs/internal-api';
import { trpcRouter } from '@libs/internal-api';
import { TRPC_ROOT_PATH } from '@libs/internal-api/consts';
import { createDevServer } from '@marbemac/server-ssr/create-dev-server';
import { extendPageEvent } from '@marbemac/ssr-solid/server';
import { createTwind } from '@marbemac/ui-twind';

import { createReqContext } from './create-req-context.ts';
import { renderToStream } from './render-to-stream.js';
import type { AppPageEvent, HonoEnv, ServerEntry } from './types.js';

const port = Number(process.env['PORT'] || 3016);

const twind = createTwind();

const { viteDevServer, server } = await createDevServer<HonoEnv, TrpcRouter, AppPageEvent, ServerEntry>({
  entryServerPath: './src/entry-server.tsx',
  hmrPort: 3026,
  trpcRootPath: TRPC_ROOT_PATH,
  trpcRouter,
  renderToStream,
  createReqContext,
  extendPageEvent: opts => ({
    ...extendPageEvent(opts),
    twind,
  }),
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
