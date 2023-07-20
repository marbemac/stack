/**
 * This is your entry point to setup the root configuration for tRPC on the server.
 * - `initTRPC` should only be used once per app.
 * - We export only the functionality that we use so we can enforce which base procedures should be used
 *
 * Learn how to create protected base procedures and other things below:
 * @see https://trpc.io/docs/v10/router
 * @see https://trpc.io/docs/v10/procedures
 */

import { initTRPC } from '@trpc/server';
import superjson from 'superjson';

import type { BaseCreateInnerContextOptions } from './context.js';

export const createTrpc = <C extends BaseCreateInnerContextOptions>() => {
  const t = initTRPC.context<C>().create({
    transformer: superjson,
  });

  /**
   * Create a router
   * @see https://trpc.io/docs/v10/router
   */
  const router = t.router;

  /**
   * @see https://trpc.io/docs/v10/middlewares
   */
  const middleware = t.middleware;

  /**
   * @see https://trpc.io/docs/v10/merging-routers
   */
  const mergeRouters = t.mergeRouters;

  /**
   * Create an unprotected procedure
   * @see https://trpc.io/docs/v10/procedures
   **/
  const publicProcedure = t.procedure;

  return {
    router,
    publicProcedure,
    middleware,
    mergeRouters,
  };
};
