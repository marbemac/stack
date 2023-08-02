import { Scripts, useHead } from '@marbemac/ssr-react';
import { Box, PrimitivesProvider } from '@marbemac/ui-primitives-react';
import type { Twind } from '@marbemac/ui-twind';
import { createStylePropsResolver } from '@marbemac/ui-twind';
import type { QueryClient } from '@tanstack/react-query';
import { Outlet, RouterContext, useRouter } from '@tanstack/router';
import React from 'react';

import { SiteNav } from '~/components/SiteNav.tsx';
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

  useHead({ title: 'Writing Demo App' });

  return (
    <PrimitivesProvider as="html" stylePropResolver={createStylePropsResolver(twind)} tw="min-h-screen">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <link
          rel="preload"
          href="/assets/fonts/inter/latin-variable.woff2"
          as="font"
          crossOrigin="anonymous"
          type="font/woff2"
        />
      </head>

      <Box as="body" tw="min-h-screen">
        <Providers queryClient={queryClient} trpc={trpc}>
          <Box tw="w-28 border-r p-4">
            <SiteNav />
          </Box>

          <Outlet />
        </Providers>

        <DehydrateRouter />

        <Scripts />
      </Box>
    </PrimitivesProvider>
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
