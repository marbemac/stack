import './root.css';

import { Box, Themed } from '@marbemac/ui-primitives';
import { Body, Head, Html, Scripts, useRequest } from '@marbemac/ui-solid-js';
import { Link as MetaLink, Meta, Title } from '@solidjs/meta';
import { useRoutes } from '@solidjs/router';
import { QueryClientProvider } from '@tanstack/solid-query';
import { Suspense } from 'solid-js';
import { HydrationScript, NoHydration } from 'solid-js/web';

import { QueryDevtools } from '~/components/QueryDevtools/index.js';
import { createRoutes } from '~/routes.js';
import { createQueryClient } from '~/utils/query-client.js';

const routeManifest = import.meta.env.DEV ? [] : '$ROUTE_MANIFEST';

export function App() {
  // const manifest = useContext(manifestContext);

  // console.log({ routeManifest, manifest });

  /**
   * Create a new query client on every request - cannot share cache on server.
   */
  const queryClient = createQueryClient();
  const Routes = useRoutes(createRoutes(queryClient));

  return (
    <Themed as={Html} lang="en" tw="min-h-screen">
      <Head>
        <Title>PLG</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />

        <MetaLink
          rel="preload"
          href="/fonts/inter/latin-variable.woff2"
          as="font"
          crossOrigin="anonymous"
          type="font/woff2"
        />
      </Head>

      <Box as={Body} tw="min-h-screen">
        <QueryClientProvider client={queryClient}>
          <Suspense fallback={'loading'}>
            <Routes />
          </Suspense>

          {/* Must wrap in div, or end up with blank screen (solid hydration issue?) */}
          <div>
            <QueryDevtools initialIsOpen={false} />
          </div>
        </QueryClientProvider>

        <Scripts />
      </Box>
    </Themed>
  );
}

function Scripts2() {
  const { env } = useRequest();

  return (
    <NoHydration>
      <HydrationScript />

      {import.meta.env.DEV ? (
        <>
          <script type="module" src="/@vite/client" $ServerOnly></script>
          <script type="module" src="/src/entry-client.tsx" $ServerOnly></script>
        </>
      ) : (
        <>
          <script type="module" src={`/${env.manifest!['entry-client']}`} $ServerOnly></script>
        </>
      )}
    </NoHydration>
  );
}
