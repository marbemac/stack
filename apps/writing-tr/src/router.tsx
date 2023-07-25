import type { TrpcRouter } from '@libs/internal-api';
import { TRPC_ROOT_PATH } from '@libs/internal-api/consts';
import { type QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Router } from '@tanstack/router';

import { debugRoute } from './routes/debug.tsx';
import { indexRoute } from './routes/index.tsx';
import { postsRoute } from './routes/posts.tsx';
import { postIdRoute } from './routes/posts/$postId.tsx';
import { postsIndexRoute } from './routes/posts/index.tsx';
import { rootRoute } from './routes/root.tsx';
import { createTRPCClient, TrpcContext } from './utils/trpc.ts';

export const routeTree = rootRoute.addChildren([
  indexRoute,
  debugRoute,
  postsRoute.addChildren([postsIndexRoute, postIdRoute]),
]);

export type RouterContext = {
  queryClient: QueryClient;
  trpc: ReturnType<typeof createTRPCClient>;
};

type CreateRouterOpts = {
  queryClient: QueryClient;
  trpcCaller?: ReturnType<TrpcRouter['createCaller']>;
};

export const createRouter = ({ queryClient, trpcCaller }: CreateRouterOpts) => {
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

    defaultPreload: 'intent',
    defaultPreloadDelay: 250,

    context: {
      queryClient,
      trpc,
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

  return router;
};

export type AppRouter = ReturnType<typeof createRouter>;

declare module '@tanstack/router' {
  interface Register {
    router: AppRouter;
  }
}
