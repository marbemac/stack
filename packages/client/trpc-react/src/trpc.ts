import { createTRPCClient as baseCreateTRPCClient } from '@marbemac/client-trpc';
import type { AnyRouter, CreateTrpcClientOpts as BaseCreateTrpcClientOpts } from '@marbemac/client-trpc';
import { useTrpcCaller } from './provider.ts';

type CreateTrpcClientOpts<T extends AnyRouter> = Pick<BaseCreateTrpcClientOpts<T>, 'config' | 'httpBatchLinkOpts'>;

export function createTRPCClient<T extends AnyRouter>(opts: CreateTrpcClientOpts<T>) {
  return baseCreateTRPCClient<T>({ ...opts, useTrpcCaller });
}
