import type { QueryClientConfig } from '@tanstack/react-query';
import { QueryCache, QueryClient } from '@tanstack/react-query';

import { hydrateStreamingData } from './hydrate-streaming-data.ts';

type CreateQueryClientOpts = {
  queryClientConfig?: Omit<QueryClientConfig, 'queryCache'>;
};

export const createQueryClient = ({ queryClientConfig }: CreateQueryClientOpts = {}) => {
  const trackedQueries = new Set<string>();
  const blockingQueries = new Map<string, Promise<void>>();
  const blockingQueryResolvers = new Map<string, () => void>();

  const queryCache = import.meta.env.SSR
    ? new QueryCache({
        onSettled(data, error, query) {
          const blockingQuery = blockingQueryResolvers.get(query.queryHash);
          if (blockingQuery) {
            blockingQuery();
          }
        },
      })
    : undefined;

  const queryClient: QueryClient = new QueryClient({
    queryCache,
    defaultOptions: {
      mutations: {
        ...queryClientConfig?.defaultOptions?.mutations,
      },
      queries: {
        suspense: true,
        retry: false,
        staleTime: 1000 * 30,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
        ...queryClientConfig?.defaultOptions?.queries,
      },
    },
  });

  // on the server
  if (import.meta.env.SSR) {
    queryClient.getQueryCache().subscribe(event => {
      const defer = event.query.meta?.['deferStream'];

      switch (event.type) {
        case 'added':
        case 'updated':
          trackedQueries.add(event.query.queryHash);

          if (event.type === 'added' && defer) {
            blockingQueries?.set(
              event.query.queryHash,
              new Promise(r => blockingQueryResolvers.set(event.query.queryHash, r)),
            );
          }
      }
    });
  } else {
    // on the client
    hydrateStreamingData({ queryClient });
  }

  return { queryClient, trackedQueries, blockingQueries };
};
