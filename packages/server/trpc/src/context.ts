// import type { Session } from '@shared/auth-external-api/types';
import type { inferAsyncReturnType } from '@trpc/server';
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

type Session = unknown;

/**
 * Defines your inner context shape.
 * Add fields here that the inner context brings.
 */
export interface BaseCreateInnerContextOptions {
  session: Session | null;
}

/**
 * Inner context. Will always be available in your procedures, in contrast to the outer context.
 *
 * Also useful for:
 * - testing, so you don't have to mock fetch `req`/`defaultPostSelect`
 * - tRPC's `createCaller` where we don't have `req`/`defaultPostSelect`
 *
 * @see https://trpc.io/docs/context#inner-and-outer-context
 */
export async function baseCreateContextInner<C extends BaseCreateInnerContextOptions>(opts: C): Promise<C> {
  return opts;
}

export function baseCreateContextFactory<C extends BaseCreateInnerContextOptions>(opts: C) {
  const createContext = (_fetchOpts: FetchCreateContextFnOptions) => {
    return baseCreateContextInner(opts);
  };

  return createContext;
}

export type Context<C extends BaseCreateInnerContextOptions> = inferAsyncReturnType<typeof baseCreateContextInner<C>>;
