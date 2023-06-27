import './root.css';

import { useRoutes } from '@solidjs/router';
import { QueryClientProvider } from '@tanstack/solid-query';
import { Suspense, useContext } from 'solid-js';
import { HydrationScript, NoHydration } from 'solid-js/web';

import { QueryDevtools } from '~/components/QueryDevtools/index.js';
import { manifestContext } from '~/manifest.js';
import { createRoutes } from '~/routes.js';
import { createQueryClient } from '~/utils/query-client.js';

export function App() {
  /**
   * Create a new query client on every request - cannot share cache on server.
   */
  const queryClient = createQueryClient();
  const Routes = useRoutes(createRoutes(queryClient));

  return (
    <html lang="en">
      <body>
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
      </body>
    </html>
  );
}

function Scripts() {
  const manifest = useContext(manifestContext);

  return (
    <NoHydration>
      <HydrationScript />

      {import.meta.env.DEV ? (
        <>
          <script type="module" src="/@vite/client" $ServerOnly></script>
          <script type="module" src="/src/app/entry-client.tsx" $ServerOnly></script>
        </>
      ) : (
        <>
          <script type="module" src={manifest['entry-client']} $ServerOnly></script>
        </>
      )}
    </NoHydration>
  );
}
