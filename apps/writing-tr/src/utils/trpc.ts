import type { TrpcRouter } from '@libs/internal-api';
import { createTRPCClient as baseCreateTRPCClient, type CreateTrpcClientOpts } from '@marbemac/client-trpc';
import { createTRPCProvider, createTRPCReact } from '@marbemac/client-trpc-react';
import type { QueryClient } from '@tanstack/react-query';

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

  const trpc = createTRPCReact<TrpcRouter>({
    client: baseClient,
    queryClient,
    unstable_overrides: {
      useMutation: {
        async onSuccess(opts) {
          // Calls the `onSuccess` defined in the `useQuery()`-options:
          await opts.originalFn();

          // Simplest cache strategy.. always invalidate active queries after any mutation
          return queryClient.invalidateQueries({
            // mark all queries as stale
            type: 'all',
            // only immediately refetch active queries
            refetchType: 'active',
          });
        },
      },
    },
  });

  return trpc;
};
