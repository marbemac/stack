import { Scripts, useHead } from '@marbemac/ssr-react';
import { Box, PrimitivesProvider } from '@marbemac/ui-primitives-react';
import type { Twind } from '@marbemac/ui-twind';
import { createStylePropsResolver } from '@marbemac/ui-twind';
import type { QueryClient } from '@tanstack/react-query';
import { Link, Outlet, RouterContext, useRouter } from '@tanstack/router';
import React from 'react';

import { Providers } from '~/providers.tsx';
import { RouterHydrationContext } from '~/utils/router-hydration-context.ts';
import type { createTRPCClient } from '~/utils/trpc.ts';

export const routerContext = new RouterContext<{
  queryClient: QueryClient;
  trpc: ReturnType<typeof createTRPCClient>;
  twind: Twind;
}>();

export const rootRoute = routerContext.createRootRoute({
  component: Root,
  wrapInSuspense: false,
});

function Root() {
  console.log('Root.render');

  const router = useRouter();
  const { queryClient, trpc, twind } = router.options.context;

  useHead({
    title: 'Root page',
    meta: [
      {
        name: 'description',
        content: 'My root page description',
      },
    ],
  });

  return (
    <Providers queryClient={queryClient} trpc={trpc}>
      <PrimitivesProvider as="html" stylePropResolver={createStylePropsResolver(twind)}>
        <head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>

        <Box as="body" tw="min-h-screen">
          <div>
            <div>
              <Link
                to="/"
                activeProps={{
                  className: 'font-bold',
                }}
                activeOptions={{ exact: true }}
              >
                Home
              </Link>{' '}
              <Link
                to="/posts"
                activeProps={{
                  className: 'font-bold',
                }}
              >
                Posts
              </Link>
              <Link
                to="/debug"
                activeProps={{
                  className: 'font-bold',
                }}
              >
                Debug
              </Link>
            </div>

            <Outlet />

            <DehydrateRouter />
          </div>

          <Scripts />
        </Box>
      </PrimitivesProvider>
    </Providers>
  );
}

export function DehydrateRouter() {
  const dehydrated = React.useContext(RouterHydrationContext);

  return (
    <script
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: `
          window.__TSR_DEHYDRATED__ = ${JSON.stringify(dehydrated)}
        `,
      }}
    />
  );
}
