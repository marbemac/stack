import { TRPC_ROOT_PATH } from '@libs/internal-api/consts';
import { Body, Head, Html, Scripts, useRequest } from '@marbemac/ssr-solid';
import { Box, Themed } from '@marbemac/ui-primitives-solid';
import { Link as MetaLink, Meta, Title } from '@solidjs/meta';
import { useRoutes } from '@solidjs/router';
import { QueryClientProvider } from '@tanstack/solid-query';

// import { QueryDevtools } from '~/components/QueryDevtools/index.js';
import { createRoutes } from '~/routes.tsx';
import { createQueryClient } from '~/utils/query-client.js';
import { createTRPCClient, TrpcContext } from '~/utils/trpc.ts';

import type { AppPageEvent } from './server/types.ts';

export function App() {
  const request = useRequest<AppPageEvent>();

  /**
   * Create a new query client on every request - cannot share cache on server.
   */
  const queryClient = createQueryClient();
  const trpc = createTRPCClient({
    queryClient,
    trpcCaller: request.trpcCaller,
    httpBatchLinkOpts: {
      url: TRPC_ROOT_PATH,
    },
  });

  const Routes = useRoutes(createRoutes(trpc));

  return (
    <Themed as={Html} lang="en" tw="min-h-screen">
      <Head>
        <Title>Writing Demo App</Title>

        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
        <MetaLink rel="icon" href="/favicon.ico" />

        <MetaLink
          rel="preload"
          href="/assets/fonts/inter/latin-variable.woff2"
          as="font"
          crossOrigin="anonymous"
          type="font/woff2"
        />
      </Head>

      <Box as={Body} tw="min-h-screen">
        <QueryClientProvider client={queryClient}>
          <TrpcContext.Provider value={{ trpc }}>
            <Routes />

            {/* <QueryDevtools initialIsOpen={false} /> */}
          </TrpcContext.Provider>
        </QueryClientProvider>

        <Scripts />
      </Box>
    </Themed>
  );
}
