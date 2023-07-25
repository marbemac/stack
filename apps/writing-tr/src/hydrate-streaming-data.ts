import type { DehydratedState, QueryClient } from '@tanstack/react-query';
import { hydrate } from '@tanstack/react-query';

declare global {
  export let $TQD: DehydratedState[];
  export let $TQS: (data: DehydratedState) => void;
}

export const hydrateStreamingData = ({ queryClient }: { queryClient: QueryClient }) => {
  function hydrateData(data: DehydratedState) {
    hydrate(queryClient, data);
  }

  // Insert data that was already streamed before this point
  // @ts-expect-error ignore
  (globalThis.$TQD ?? []).map(hydrateData);

  // Delete the global variable so that it doesn't get serialized again
  // @ts-expect-error ignore
  delete globalThis.$TQD;

  // From now on, insert data directly
  // @ts-expect-error ignore
  globalThis.$TQS = hydrateData;
};
