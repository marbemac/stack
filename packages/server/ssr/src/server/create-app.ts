import { Hono } from 'hono';

import type { BaseHonoEnv } from './types.js';

export const createApp = <HonoEnv extends BaseHonoEnv>() => {
  const app = new Hono<HonoEnv>();

  return app;
};
