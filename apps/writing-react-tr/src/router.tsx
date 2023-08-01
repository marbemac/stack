import type { TrpcRouter } from '@libs/internal-api';
import { TRPC_ROOT_PATH } from '@libs/internal-api/consts';
import { PrimitivesProvider } from '@marbemac/ui-primitives-react';
import type { Twind } from '@marbemac/ui-twind';
import { createStylePropsResolver } from '@marbemac/ui-twind';
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

type CreateRouterOpts = {
  queryClient: QueryClient;
  twind: Twind;
  trpcCaller?: ReturnType<TrpcRouter['createCaller']>;
};

export const createRouter = ({ queryClient, twind, trpcCaller }: CreateRouterOpts) => {
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

    Wrap: ({ children }) => {
      return (
        <PrimitivesProvider stylePropResolver={createStylePropsResolver(twind)}>
          <QueryClientProvider client={queryClient}>
            <TrpcContext.Provider value={{ trpc }}>{children}</TrpcContext.Provider>
          </QueryClientProvider>
        </PrimitivesProvider>
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
