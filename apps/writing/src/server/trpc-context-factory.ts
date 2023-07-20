import { createContextFactory } from '@libs/internal-api';
import type { Context } from 'hono';

import type { HonoEnv } from './types.js';

export const trpcContextFactory = (c: Context<HonoEnv>) => {
  const models = c.get('models');
  const session = c.get('session');

  return createContextFactory({ models, session });
};
