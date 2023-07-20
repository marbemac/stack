import type { TrpcRouter } from '@libs/internal-api';
import type { CreateTrpcClientOpts } from '@marbemac/client-trpc-solid';
import {
  createTRPCClient as baseCreateTRPCClient,
  createTRPCProvider,
  createTRPCSolid,
} from '@marbemac/client-trpc-solid';
import type { QueryClient } from '@tanstack/solid-query';

const { useTrpc, TrpcContext } = createTRPCProvider<TrpcRouter>();

export { TrpcContext, useTrpc };

export type CreateTRPCClientOpts = CreateTrpcClientOpts<TrpcRouter> & {
  queryClient: QueryClient;
  trpcCaller?: ReturnType<TrpcRouter['createCaller']>;
};

export const createTRPCClient = ({ trpcCaller, queryClient, ...rest }: CreateTRPCClientOpts) => {
  const baseClient = baseCreateTRPCClient<TrpcRouter>({
    trpcCaller,
    ...rest,
  });

  const trpc = createTRPCSolid<TrpcRouter>({
    client: baseClient,
    queryClient,
  });

  return trpc;
};
