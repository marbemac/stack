import { TRPCError } from '@trpc/server';

export class NotFoundError extends TRPCError {
  constructor(
    opts: {
      cause?: unknown;
    } = {},
  ) {
    super({
      code: 'NOT_FOUND',
      message: 'Not found',
      cause: opts.cause,
    });
  }
}
