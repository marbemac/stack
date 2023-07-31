import type { Context as InternalAPIContext, TrpcRouter } from '@libs/internal-api';
import type { BaseHonoEnv, CreateReqContextFn, RenderFn as BaseRenderFn, ServerEntryFns } from '@marbemac/server-ssr';
import type { PageEvent } from '@marbemac/ssr-react';
import type { Twind } from '@marbemac/ui-twind';
import type { QueryClient } from '@tanstack/react-query';
import type { Hono } from 'hono';
import type { ReactNode } from 'react';

import type { AppRouter } from '~/router.tsx';

export type AppPageEvent = PageEvent<TrpcRouter> & {
  twind: Twind;
};

export type RenderFn = BaseRenderFn<
  AppPageEvent,
  Promise<{
    app: ReactNode;
    queryClient: QueryClient;
    router: AppRouter;
    trackedQueries: Set<string>;
    blockingQueries: Map<string, Promise<void>>;
  }>
>;

export type ServerEntry = ServerEntryFns<AppPageEvent, RenderFn>;

export type CreateReqContext = CreateReqContextFn<HonoEnv>;

export interface HonoEnv extends BaseHonoEnv {
  Bindings: BaseHonoEnv['Bindings'] & {
    SQL_URL: string;
    AUTH_SECRET: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_SECRET: string;
  };

  Variables: BaseHonoEnv['Variables'] & InternalAPIContext;
}

export type HonoApp = Hono<HonoEnv>;
