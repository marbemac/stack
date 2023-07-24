import type { TrpcRouter } from '@libs/internal-api';
import { TRPC_ROOT_PATH } from '@libs/internal-api/consts';
import { dehydrate, hydrate, type QueryClient, QueryClientProvider, QueryObserver } from '@tanstack/react-query';
import { Router } from '@tanstack/router';

import { indexRoute } from './routes/index.tsx';
import { postsRoute } from './routes/posts.tsx';
import { postIdRoute } from './routes/posts/$postId.tsx';
import { postsIndexRoute } from './routes/posts/index.tsx';
import { rootRoute } from './routes/root.tsx';
import { createQueryClient } from './utils/query-client.ts';
import { createTRPCClient, TrpcContext } from './utils/trpc.ts';

export const routeTree = rootRoute.addChildren([indexRoute, postsRoute.addChildren([postsIndexRoute, postIdRoute])]);

export type RouterContext = {
  queryClient: QueryClient;
  trpc: ReturnType<typeof createTRPCClient>;
  head: string;
};

type CreateRouterOpts = {
  trpcCaller?: ReturnType<TrpcRouter['createCaller']>;
};

export const createRouter = ({ trpcCaller }: CreateRouterOpts = {}) => {
  const queryClient = createQueryClient();

  console.log('createRouter');

  const trpc = createTRPCClient({
    queryClient,
    trpcCaller,
    httpBatchLinkOpts: {
      url: TRPC_ROOT_PATH,
    },
  });

  const router = new Router({
    routeTree,
    context: {
      queryClient,
      trpc,
      head: '',
    },

    // On the server, dehydrate the loader client
    dehydrate: () => {
      return {
        queryClient: dehydrate(queryClient),
      };
    },

    // On the client, rehydrate the loader client
    hydrate: dehydrated => {
      hydrate(queryClient, dehydrated.queryClient);
    },

    // Wrap our router in the loader client provider
    Wrap: ({ children }) => {
      return (
        <QueryClientProvider client={queryClient}>
          <TrpcContext.Provider value={{ trpc }}>{children}</TrpcContext.Provider>
        </QueryClientProvider>
      );
    },
  });

  // const queryCache = queryClient.getQueryCache();
  // queryCache
  // queryCache.notify({type: 'added', query: {}})
  // queryCache.subscribe(() => {
  //   console.log(queryCache.getAll());
  // });

  // Provide hydration and dehydration functions to loader instances
  // loaderClient.options = {
  //   ...loaderClient.options,
  //   hydrateLoaderInstanceFn: (instance) =>
  //     router.hydrateData(instance.hashedKey) as any,
  //   dehydrateLoaderInstanceFn: (instance) =>
  //     router.dehydrateData(instance.hashedKey, () => instance.state),
  // }

  return router;
};

declare module '@tanstack/router' {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
