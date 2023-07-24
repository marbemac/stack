import { initDbConn } from '@libs/db';
import { initDbClient } from '@libs/db-model/client';
import { initModels } from '@libs/db-model/models';
import type { MiddlewareHandler } from 'hono';

import type { HonoEnv } from './types.js';

export const globalMiddleware = (): MiddlewareHandler<HonoEnv> => {
  return async (c, next) => {
    const db = initDbConn({ filename: c.env.SQL_URL });
    const dbClient = initDbClient({ db });
    const models = initModels({ dbClient });

    c.set('models', models);

    await next();
  };
};
