import type { Models } from '@libs/db-model/models';
import type { BaseCreateInnerContextOptions } from '@marbemac/server-trpc';
import { baseCreateContextFactory, baseCreateContextInner } from '@marbemac/server-trpc';
import type { inferAsyncReturnType } from '@trpc/server';

/**
 * Defines your inner context shape.
 * Add fields here that the inner context brings.
 */
interface CreateInnerContextOptions extends BaseCreateInnerContextOptions {
  models: Models;
}

export const createContextInner = baseCreateContextInner<CreateInnerContextOptions>;
export const createContextFactory = baseCreateContextFactory<CreateInnerContextOptions>;

export type Context = inferAsyncReturnType<typeof createContextInner>;
