import type { Models } from '@libs/db-model/models';
import type { TrpcRouter } from '@libs/internal-api';
import type { PageEvent } from '@marbemac/server-ssr';
import type { BaseHonoEnv } from '@marbemac/server-ssr/server';
import type { Hono } from 'hono';

export type AppPageEvent = PageEvent<TrpcRouter>;

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
