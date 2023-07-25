import { TwindStream } from '@marbemac/server-twind-stream';
import type { AnyRouter } from '@trpc/server';
import type { FetchCreateContextFn } from '@trpc/server/adapters/fetch';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import type { Twind } from '@twind/core';
import type { Context, Hono, MiddlewareHandler } from 'hono';

import type { PageEvent as BasePageEvent } from '../types.js';
import { createPageEvent } from './page-event.js';
import type { BaseHonoEnv } from './types.js';

export type RenderFn<PageEvent extends BasePageEvent, R = unknown> = ({
  event,
}: {
  event: PageEvent;
}) => R | Promise<R>;

export type ProvideAppFns<PageEvent extends BasePageEvent, TRenderFn extends RenderFn<PageEvent>> = () => Promise<{
  render: TRenderFn;
  tw: Twind<any, any>;
}>;

type RenderToStreamFn<PageEvent extends BasePageEvent, TRenderFn extends RenderFn<PageEvent>> = (opts: {
  writable: WritableStream<Uint8Array>;
  render: TRenderFn;
  pageEvent: PageEvent;
}) => Promise<void>;

// export type AuthRouterFactory<HonoEnv extends BaseHonoEnv> = () => AuthRouter<HonoEnv>;

export type TrpcContextFactory<HonoEnv extends BaseHonoEnv, TRouter extends AnyRouter> = (
  c: Context<HonoEnv>,
) => FetchCreateContextFn<TRouter>;

export interface BaseRegisterAppHandlerOptions<
  HonoEnv extends BaseHonoEnv,
  TRouter extends AnyRouter,
  PageEvent extends BasePageEvent,
  TRenderFn extends RenderFn<PageEvent>,
> {
  app: Hono<HonoEnv>;
  renderToStream: RenderToStreamFn<PageEvent, TRenderFn>;
  globalMiddlware?: MiddlewareHandler<HonoEnv>;
  // authRouterFactory?: AuthRouterFactory<HonoEnv>;
  trpcRouter: TRouter;
  trpcContextFactory: TrpcContextFactory<HonoEnv, TRouter>;
  trpcRootPath: string;
  env?: Partial<Env>;
}

export interface DevRegisterAppHandlerOptions<
  HonoEnv extends BaseHonoEnv,
  TRouter extends AnyRouter,
  PageEvent extends BasePageEvent,
  TRenderFn extends RenderFn<PageEvent>,
> extends BaseRegisterAppHandlerOptions<HonoEnv, TRouter, PageEvent, TRenderFn> {
  provideAppFns: ProvideAppFns<PageEvent, TRenderFn>;
}

export interface ProdRegisterAppHandlerOptions<
  HonoEnv extends BaseHonoEnv,
  TRouter extends AnyRouter,
  PageEvent extends BasePageEvent,
  TRenderFn extends RenderFn<PageEvent>,
> extends BaseRegisterAppHandlerOptions<HonoEnv, TRouter, PageEvent, TRenderFn> {
  render: TRenderFn;
  tw: Twind<any, any>;
}

export type RegisterAppHandlerOptions<
  HonoEnv extends BaseHonoEnv,
  TRouter extends AnyRouter,
  PageEvent extends BasePageEvent,
  TRenderFn extends RenderFn<PageEvent>,
> =
  | DevRegisterAppHandlerOptions<HonoEnv, TRouter, PageEvent, TRenderFn>
  | ProdRegisterAppHandlerOptions<HonoEnv, TRouter, PageEvent, TRenderFn>;

export const registerAppHandler = <
  HonoEnv extends BaseHonoEnv,
  TRouter extends AnyRouter,
  PageEvent extends BasePageEvent<TRouter>,
  TRenderFn extends RenderFn<PageEvent>,
>(
  opts: RegisterAppHandlerOptions<HonoEnv, TRouter, PageEvent, TRenderFn>,
) => {
  const { app, renderToStream, globalMiddlware, env: baseEnv, trpcRouter, trpcRootPath, trpcContextFactory } = opts;

  const env: Env = Object.freeze(Object.assign({}, baseEnv));

  if (globalMiddlware) {
    app.use('*', globalMiddlware);
  }

  // if (authRouterFactory) {
  //   const authRouter = authRouterFactory();

  //   app.use('*', authRouter.middleware.setAuthConfig);
  //   app.use('*', authRouter.middleware.setSession);

  //   app.route(EXTERNAL_API_BASE_PATH, authRouter.routes);
  // }

  app.all(`${trpcRootPath}/*`, c => {
    return fetchRequestHandler({
      endpoint: trpcRootPath,
      req: c.req.raw,
      router: trpcRouter,
      createContext: trpcContextFactory(c),
      onError({ error, path, type }) {
        if (error.code === 'INTERNAL_SERVER_ERROR') {
          // @TODO: send to sentry, etc
          console.error('[trpc error]', { type, path, error });
        }
      },
    });
  });

  app.get('*', async c => {
    const createContext = trpcContextFactory(c);
    const ctx = await createContext({ req: c.req.raw, resHeaders: c.res.headers });
    const pageEvent = createPageEvent<PageEvent>({ req: c.req.raw, env, trpcCaller: trpcRouter.createCaller(ctx) });

    let tw;
    let render: TRenderFn;
    if (isDevOptions<HonoEnv, TRouter, PageEvent, TRenderFn>(opts)) {
      // load ssr module on every request in dev, so that hot reload works on the SSR side of things
      const fns = await opts.provideAppFns();
      tw = fns.tw;
      render = fns.render;
    } else {
      tw = opts.tw;
      render = opts.render;
    }

    const { readable, writable } = new TwindStream(tw);
    await renderToStream({
      writable,
      render,
      pageEvent,
    });

    return new Response(readable, {
      status: pageEvent.getStatusCode(),
      headers: pageEvent.responseHeaders,
    });
  });
};

function isDevOptions<
  HonoEnv extends BaseHonoEnv,
  TRouter extends AnyRouter,
  PageEvent extends BasePageEvent,
  TRenderFn extends RenderFn<PageEvent>,
>(
  opts: RegisterAppHandlerOptions<HonoEnv, TRouter, PageEvent, TRenderFn>,
): opts is DevRegisterAppHandlerOptions<HonoEnv, TRouter, PageEvent, TRenderFn> {
  return Object.prototype.hasOwnProperty.call(opts, 'provideAppFns');
}
