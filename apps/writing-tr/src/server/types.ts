import type { Models } from '@libs/db-model/models';
import type { TrpcRouter } from '@libs/internal-api';
import type { PageEvent } from '@marbemac/server-ssr';
import type { BaseHonoEnv, RenderFn as BaseRenderFn } from '@marbemac/server-ssr/server';
import type { AnyRouter } from '@tanstack/router';
import type { Hono } from 'hono';
import type { ReactNode } from 'react';

export type AppPageEvent = PageEvent<TrpcRouter>;

export type RenderFn = BaseRenderFn<AppPageEvent, { app: ReactNode; router: AnyRouter }>;

export interface HonoEnv extends BaseHonoEnv {
  Bindings: BaseHonoEnv['Bindings'] & {
    SQL_URL: string;
    AUTH_SECRET: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_SECRET: string;
  };

  Variables: BaseHonoEnv['Variables'] & {
    models: Models;
    session: unknown;
  };
}

export type HonoApp = Hono<HonoEnv>;