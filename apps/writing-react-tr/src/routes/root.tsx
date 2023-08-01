import { Scripts, useHead } from '@marbemac/ssr-react';
import { Box } from '@marbemac/ui-primitives-react';
import type { QueryClient } from '@tanstack/react-query';
import { Link, Outlet, RouterContext } from '@tanstack/router';
import React from 'react';

// import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { RouterHydrationContext } from '~/utils/router-hydration-context.ts';
import type { createTRPCClient } from '~/utils/trpc.ts';

export const routerContext = new RouterContext<{
  queryClient: QueryClient;
  trpc: ReturnType<typeof createTRPCClient>;
}>();

export const rootRoute = routerContext.createRootRoute({
  component: Root,
  wrapInSuspense: false,
});

function Root() {
  console.log('Root.render');

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
    <html lang="en">
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
          <Outlet /> {/* Start rendering router matches */}
          {/* <TanStackRouterDevtools position="bottom-right" /> */}
          <DehydrateRouter />
        </div>

        <Scripts />
      </Box>
    </html>
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
