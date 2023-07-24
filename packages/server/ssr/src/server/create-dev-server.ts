import { resolve } from 'node:path';

import { createAdaptorServer } from '@marbemac/server-hono-node';
import type { AnyRouter } from '@trpc/server';
import connect from 'connect';
import * as R from 'remeda';
import { createServer as createViteServer } from 'vite';

import type { PageEvent as BasePageEvent } from '../types.js';
import { createApp } from './create-app.js';
import type { DevRegisterAppHandlerOptions, ProvideAppFns, RenderFn } from './register-app-handler.js';
import { registerAppHandler } from './register-app-handler.js';
import type { BaseHonoEnv } from './types.js';

const isTest = process.env['NODE_ENV'] === 'test' || !!process.env['VITE_TEST_BUILD'];
const root = process.cwd();

interface CreateDevServerOpts<
  HonoEnv extends BaseHonoEnv,
  TRouter extends AnyRouter,
  PageEvent extends BasePageEvent,
  TRenderFn extends RenderFn<PageEvent>,
> extends Pick<
    DevRegisterAppHandlerOptions<HonoEnv, TRouter, PageEvent, TRenderFn>,
    'renderToStream' | 'globalMiddlware' | 'trpcRootPath' | 'trpcRouter' | 'trpcContextFactory'
  > {
  hmrPort: number;
  entryServerPath: string;
  envVariablesList: Readonly<string[]>;
}

export const createDevServer = async <
  HonoEnv extends BaseHonoEnv,
  TRouter extends AnyRouter,
  PageEvent extends BasePageEvent,
  TRenderFn extends RenderFn<PageEvent>,
>(
  opts: CreateDevServerOpts<HonoEnv, TRouter, PageEvent, TRenderFn>,
) => {
  const {
    hmrPort,
    entryServerPath,
    renderToStream,
    globalMiddlware,
    trpcRootPath,
    trpcRouter,
    envVariablesList,
    trpcContextFactory,
  } = opts;

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
    TRenderFn
  >;

  const app = createApp<HonoEnv>();

  registerAppHandler<HonoEnv, TRouter, PageEvent, TRenderFn>({
    app,
    provideAppFns,
    renderToStream,
    globalMiddlware,
    // authRouterFactory,
    trpcRouter,
    trpcRootPath,
    trpcContextFactory,
  });

  const server = createAdaptorServer({
    connectApp: viteDevServerApp,
    fetch: req => {
      return app.fetch(req, R.pick(process.env, envVariablesList));
    },
  });

  return { viteDevServer, server };
};
