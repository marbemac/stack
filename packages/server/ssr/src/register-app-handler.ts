import type { AnyRouter } from '@trpc/server';
import type { FetchCreateContextFn } from '@trpc/server/adapters/fetch';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import type { Context, Hono } from 'hono';
import { env as getEnv } from 'hono/adapter';

import { createPageEvent } from './page-event.js';
import type { BaseHonoEnv, ExtendPageEventFnOpts, PageEvent as BasePageEvent } from './types.js';

export type ServerEntryFns<PageEvent extends BasePageEvent, R extends RenderFn<PageEvent> = RenderFn<PageEvent>> = {
  render: R;
};

export type RenderFn<PageEvent extends BasePageEvent, R = unknown> = ({
  pageEvent,
}: {
  pageEvent: Readonly<PageEvent>;
}) => R;

export type ProvideAppFns<
  PageEvent extends BasePageEvent,
  ServerEntry extends ServerEntryFns<PageEvent>,
> = () => Promise<ServerEntry>;

export type RenderToStreamFn<PageEvent extends BasePageEvent, ServerEntry extends ServerEntryFns<PageEvent>> = (
  opts: {
    pageEvent: Readonly<PageEvent>;
  } & ServerEntry,
) => Promise<ReadableStream>;

// export type AuthRouterFactory<HonoEnv extends BaseHonoEnv> = () => AuthRouter<HonoEnv>;

export type TrpcContextFactory<HonoEnv extends BaseHonoEnv, TRouter extends AnyRouter> = (
  c: Context<HonoEnv>,
) => FetchCreateContextFn<TRouter>;

export type CreateReqContextFn<HonoEnv extends BaseHonoEnv> = (opts: {
  req: Request;
  env: HonoEnv['Bindings'];
}) => Promise<HonoEnv['Variables']> | HonoEnv['Variables'];

export interface BaseRegisterAppHandlerOptions<
  HonoEnv extends BaseHonoEnv,
  TRouter extends AnyRouter,
  PageEvent extends BasePageEvent,
  ServerEntry extends ServerEntryFns<PageEvent>,
> {
  app: Hono<HonoEnv>;
  renderToStream: RenderToStreamFn<PageEvent, ServerEntry>;
  trpcRouter: TRouter;
  trpcRootPath: string;
  createReqContext: CreateReqContextFn<HonoEnv>;
  extendPageEvent?: (opts: ExtendPageEventFnOpts<BasePageEvent<TRouter>>) => PageEvent;
  env?: Partial<Env>;
}

export interface DevRegisterAppHandlerOptions<
  HonoEnv extends BaseHonoEnv,
  TRouter extends AnyRouter,
  PageEvent extends BasePageEvent,
  ServerEntry extends ServerEntryFns<PageEvent>,
> extends BaseRegisterAppHandlerOptions<HonoEnv, TRouter, PageEvent, ServerEntry> {
  provideAppFns: ProvideAppFns<PageEvent, ServerEntry>;
}

export interface ProdRegisterAppHandlerOptions<
  HonoEnv extends BaseHonoEnv,
  TRouter extends AnyRouter,
  PageEvent extends BasePageEvent,
  ServerEntry extends ServerEntryFns<PageEvent>,
> extends BaseRegisterAppHandlerOptions<HonoEnv, TRouter, PageEvent, ServerEntry> {
  serverEntry: ServerEntry;
}

export type RegisterAppHandlerOptions<
  HonoEnv extends BaseHonoEnv,
  TRouter extends AnyRouter,
  PageEvent extends BasePageEvent,
  ServerEntry extends ServerEntryFns<PageEvent>,
> =
  | DevRegisterAppHandlerOptions<HonoEnv, TRouter, PageEvent, ServerEntry>
  | ProdRegisterAppHandlerOptions<HonoEnv, TRouter, PageEvent, ServerEntry>;

export const registerAppHandler = <
  HonoEnv extends BaseHonoEnv,
  TRouter extends AnyRouter,
  PageEvent extends BasePageEvent<TRouter>,
  ServerEntry extends ServerEntryFns<PageEvent>,
>(
  opts: RegisterAppHandlerOptions<HonoEnv, TRouter, PageEvent, ServerEntry>,
) => {
  const { app, renderToStream, createReqContext, env: baseEnv, trpcRouter, trpcRootPath, extendPageEvent } = opts;

  const env: Env = Object.freeze(Object.assign({}, baseEnv));

  // if (globalMiddlware) {
  //   app.use('*', globalMiddlware);
  // }

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
      createContext: createReqContext
        ? ({ req }) => {
            return createReqContext({ req, env: getEnv(c) });
          }
        : undefined,
      onError({ error, path, type }) {
        if (error.code === 'INTERNAL_SERVER_ERROR') {
          // @TODO: send to sentry, etc
          console.error('[trpc error]', { type, path, error });
        }
      },
    });
  });

  app.get('*', async c => {
    let ctx = createReqContext ? createReqContext({ req: c.req.raw, env: getEnv(c) }) : undefined;
    if (ctx instanceof Promise) {
      ctx = await ctx;
    }

    let pageEvent = createPageEvent({
      req: c.req.raw,
      env,
      trpcCaller: trpcRouter.createCaller(ctx),
    }) as PageEvent;

    if (extendPageEvent) {
      pageEvent = extendPageEvent({ pageEvent });
    }

    let serverEntry: ServerEntry;
    if (isDevOptions<HonoEnv, TRouter, PageEvent, ServerEntry>(opts)) {
      // load ssr module on every request in dev, so that hot reload works on the SSR side of things
      serverEntry = await opts.provideAppFns();
    } else {
      serverEntry = opts.serverEntry;
    }

    const appStream = await renderToStream({
      pageEvent,
      ...serverEntry,
    });

    return new Response(appStream, {
      status: pageEvent.getStatusCode(),
      headers: pageEvent.responseHeaders,
    });
  });
};

function isDevOptions<
  HonoEnv extends BaseHonoEnv,
  TRouter extends AnyRouter,
  PageEvent extends BasePageEvent,
  ServerEntry extends ServerEntryFns<PageEvent>,
>(
  opts: RegisterAppHandlerOptions<HonoEnv, TRouter, PageEvent, ServerEntry>,
): opts is DevRegisterAppHandlerOptions<HonoEnv, TRouter, PageEvent, ServerEntry> {
  return Object.prototype.hasOwnProperty.call(opts, 'provideAppFns');
}
