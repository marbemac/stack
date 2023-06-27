import { QueryClient } from "@tanstack/solid-query";

export const createQueryClient = () => {
  const queryClient: QueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 1000 * 30,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,

        /**
         * buggy - try turning on and switching between posts quickly - note data gets
         * corrupted and shows wrong data for given post after a while
         */
        reconcile: false,
      },
      mutations: {
        onSuccess() {
          // Simplest cache strategy.. always invalidate active queries after any mutation
          return queryClient.invalidateQueries({
            // mark all queries as stale
            type: "all",
            // only immediately refetch active queries
            refetchType: "active",
          });
        },
      },
    },
  });

  return queryClient;
};
