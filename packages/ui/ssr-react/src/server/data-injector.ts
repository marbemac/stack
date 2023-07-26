import { injectIntoSSRStream } from '@marbemac/server-ssr';
import type { DehydrateOptions, HydrateOptions, QueryClient } from '@tanstack/react-query';
import { defaultShouldDehydrateQuery, dehydrate } from '@tanstack/react-query';

export const createQueryDataInjector = ({
  blockingQueries,
  trackedQueries,
  queryClient,
  options,
  serialize,
}: {
  trackedQueries: Set<string>;
  blockingQueries: Map<string, Promise<void>>;
  queryClient: QueryClient;
  options?: {
    hydrate?: HydrateOptions;
    dehydrate?: DehydrateOptions;
  };
  serialize?: (object: any) => any;
}) => {
  return injectIntoSSRStream({
    emitToDocumentHead() {
      const html: string[] = [`$TQD = [];`, `$TQS = data => $TQD.push(data);`];

      return `<script>${html.join('')}</script>`;
    },

    async emitBeforeSsrChunk() {
      // If there are any queries marked with deferStream, block the stream until they are completed
      if (blockingQueries.size) {
        await Promise.allSettled(blockingQueries.values());
        blockingQueries.clear();
      }

      if (!trackedQueries.size) return '';

      /**
       * Dehydrated state of the client where we only include the queries that were added/updated since the last flush
       */
      const shouldDehydrate = options?.dehydrate?.shouldDehydrateQuery ?? defaultShouldDehydrateQuery;

      const dehydratedState = dehydrate(queryClient, {
        ...options?.dehydrate,
        shouldDehydrateQuery(query) {
          return trackedQueries.has(query.queryHash) && shouldDehydrate(query);
        },
      });
      trackedQueries.clear();

      if (!dehydratedState.queries.length) return '';

      const dehydratedString = serialize ? serialize(dehydratedState) : JSON.stringify(dehydratedState);

      const html: string[] = [`$TQS(${dehydratedString})`];

      return `<script>${html.join('')}</script>`;
    },
  });
};
