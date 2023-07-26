import type { RenderToStreamFn } from '@marbemac/server-ssr';
import { TwindStream } from '@marbemac/server-twind-stream';
import { createQueryDataInjector } from '@marbemac/ui-react/server';
import { uneval } from 'devalue';
import { renderToReadableStream } from 'react-dom/server';

import type { AppPageEvent, ServerEntry } from './types.ts';

export const createRenderToStreamFn =
  (): RenderToStreamFn<AppPageEvent, ServerEntry> =>
  async ({ render, pageEvent, tw }) => {
    const { app, queryClient, trackedQueries, blockingQueries } = await render({ event: pageEvent });

    const appStream = await renderToReadableStream(app);

    const isCrawler = false;
    if (isCrawler) {
      await appStream.allReady;
    }

    return appStream
      .pipeThrough(new TwindStream(tw))
      .pipeThrough(createQueryDataInjector({ blockingQueries, trackedQueries, queryClient, serialize: uneval }));
  };
