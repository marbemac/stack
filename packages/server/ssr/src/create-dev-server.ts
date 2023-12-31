import { resolve } from 'node:path';

import { createAdaptorServer } from '@marbemac/server-hono-node';
import type { AnyRouter } from '@trpc/server';
import connect from 'connect';
import { createServer as createViteServer } from 'vite';

import { createApp } from './create-app.js';
import type { DevRegisterAppHandlerOptions, ProvideAppFns, ServerEntryFns } from './register-app-handler.js';
import { registerAppHandler } from './register-app-handler.js';
import type { BaseHonoEnv, PageEvent as BasePageEvent } from './types.js';

const isTest = process.env['NODE_ENV'] === 'test' || !!process.env['VITE_TEST_BUILD'];
const root = process.cwd();

interface CreateDevServerOpts<
  HonoEnv extends BaseHonoEnv,
  TRouter extends AnyRouter,
  PageEvent extends BasePageEvent,
  ServerEntry extends ServerEntryFns<PageEvent>,
> extends Pick<
    DevRegisterAppHandlerOptions<HonoEnv, TRouter, PageEvent, ServerEntry>,
    'renderToStream' | 'trpcRootPath' | 'trpcRouter' | 'createReqContext' | 'extendPageEvent'
  > {
  hmrPort: number;
  entryServerPath: string;
}

export const createDevServer = async <
  HonoEnv extends BaseHonoEnv,
  TRouter extends AnyRouter,
  PageEvent extends BasePageEvent,
  ServerEntry extends ServerEntryFns<PageEvent>,
>(
  opts: CreateDevServerOpts<HonoEnv, TRouter, PageEvent, ServerEntry>,
) => {
  const { hmrPort, entryServerPath, renderToStream, trpcRootPath, trpcRouter, createReqContext, extendPageEvent } =
    opts;

  const viteDevServer = await createViteServer({
    root,
    logLevel: isTest ? 'error' : 'info',
    appType: 'custom',
    server: {
      middlewareMode: true,
      hmr: {
        port: hmrPort,
      },
      watch: {
        usePolling: true,
        interval: 100,
      },
    },
  });

  // use vite's connect instance as middleware
  const viteDevServerApp = connect().use(viteDevServer.middlewares);

  // In dev mode, entry.server will be loaded in it's own module scope, so it must import anything "stateful"
  // This includes anything that imports react or solidjs (due to context), and twind
  const provideAppFns = (() => viteDevServer.ssrLoadModule(resolve(entryServerPath))) as ProvideAppFns<
    PageEvent,
    ServerEntry
  >;

  const app = createApp<HonoEnv>();

  registerAppHandler<HonoEnv, TRouter, PageEvent, ServerEntry>({
    app,
    provideAppFns,
    renderToStream,
    trpcRouter,
    trpcRootPath,
    createReqContext,
    extendPageEvent,
  });

  const server = createAdaptorServer({
    connectApp: viteDevServerApp,
    fetch: req => {
      return app.fetch(req, process.env);
    },
  });

  return { viteDevServer, server };
};
