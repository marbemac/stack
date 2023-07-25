import { render as baseRender } from '@marbemac/ui-react/server';
import { createMemoryHistory, RouterProvider } from '@tanstack/router';
import React from 'react';

import { createRouter } from '~/router.tsx';
import { createQueryClient } from '~/utils/query-client.js';
import { RouterHydrationContext } from '~/utils/router-hydration-context.js';

import type { AppPageEvent, RenderFn } from './types.js';

export { tw } from '@marbemac/ui-twind';

export const render: RenderFn = async ({ event }: { event: AppPageEvent }) => {
  const url = new URL(event.url);

  const pathWithSearch = `${url.pathname}${url.search}`;

  /**
   * Create a new router on every request - cannot share caches on server.
   */
  const trackedQueries = new Set<string>();
  const blockingQueries = new Map<string, Promise<void>>();
  const queryClient = createQueryClient({ trackedQueries, blockingQueries });
  const router = createRouter({ queryClient, trpcCaller: event.trpcCaller });

  const memoryHistory = createMemoryHistory({
    initialEntries: [pathWithSearch],
  });

  // Update the history and context
  router.update({
    history: memoryHistory,
    context: {
      ...router.context,
    },
  });

  // Wait for the router to load critical data
  // (streamed data will continue to load in the background)
  await router.load();

  const hydrationCtxValue = {
    router: router.dehydrate(),
    payload: router.options.dehydrate?.(),
  };

  const Wrap = router.options.Wrap || React.Fragment;

  const app = baseRender({
    event,
    Root: () => (
      <Wrap>
        <RouterHydrationContext.Provider value={hydrationCtxValue}>
          <RouterProvider router={router} />
        </RouterHydrationContext.Provider>
      </Wrap>
    ),
  });

  return { app, queryClient, router, trackedQueries, blockingQueries };
};
