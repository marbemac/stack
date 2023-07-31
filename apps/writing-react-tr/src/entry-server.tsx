import { createQueryClient } from '@marbemac/ssr-react/client';
import { render as baseRender } from '@marbemac/ssr-react/server';
import { createMemoryHistory, RouterProvider } from '@tanstack/router';
import React from 'react';

import { createRouter } from './router.tsx';
import type { RenderFn } from './server/types.js';
import { RouterHydrationContext } from './utils/router-hydration-context.js';

export const render: RenderFn = async ({ pageEvent }) => {
  pageEvent.twind.injectGlobal(`
    @font-face {
      font-display: swap;
      font-family: 'Inter';
      font-weight: 200 900;
      font-stretch: 25% 151%;
      src: url('/assets/fonts/inter/latin-variable.woff2') format('woff2');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329,
        U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }

    /* Generated with https://github.com/pixel-point/fontpie */
    @font-face {
      font-family: 'Inter-fallback';
      font-style: normal;
      font-weight: 400;
      src: local('Arial');
      ascent-override: 90%;
      descent-override: 22.43%;
      line-gap-override: 0%;
      size-adjust: 107.64%;
    }
  `);

  const url = new URL(pageEvent.url);

  const pathWithSearch = `${url.pathname}${url.search}`;

  /**
   * Create a new query client / router on every request - cannot share caches on server.
   */
  const { queryClient, blockingQueries, trackedQueries } = createQueryClient();
  const router = createRouter({ queryClient, twind: pageEvent.twind, trpcCaller: pageEvent.trpcCaller });

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
    pageEvent,
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
