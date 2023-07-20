import { TRPCClientError } from '@trpc/client';
import type { AnyProcedure } from '@trpc/server';

export function isTrpcClientError(error: unknown): error is TRPCClientError<AnyProcedure> {
  return Boolean(error && error instanceof TRPCClientError);
}

export function isTrpcNotFound(error: unknown) {
  if (!isTrpcClientError(error)) return false;

  return error.data?.httpStatus === 404 || error.data?.code === 'NOT_FOUND';
}

export function isTrpcUnauthorized(error: unknown) {
  if (!isTrpcClientError(error)) return false;

  return error.data?.code === 'UNAUTHORIZED';
}
