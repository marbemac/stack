import { QueryCache, QueryClient } from '@tanstack/react-query';

import { hydrateStreamingData } from '~/hydrate-streaming-data.ts';

type CreateQueryClientOpts = {
  trackedQueries?: Set<string>;
  blockingQueries?: Map<string, Promise<void>>;
};

export const createQueryClient = ({ trackedQueries, blockingQueries }: CreateQueryClientOpts = {}) => {
  const blockingQueryResolvers = new Map<string, () => void>();

  const queryCache = blockingQueries
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
      queries: {
        suspense: true,
        retry: false,
        staleTime: 1000 * 30,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
      },
    },
  });

  // on the server
  if (trackedQueries && import.meta.env.SSR) {
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

  return queryClient;
};
