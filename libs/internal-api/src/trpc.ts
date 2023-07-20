import { createTrpc } from '@marbemac/server-trpc';

import type { Context } from './context.js';

const t = createTrpc<Context>();

export const router = t.router;

export const publicProcedure = t.publicProcedure;

export const middleware = t.middleware;

export const mergeRouters = t.mergeRouters;
