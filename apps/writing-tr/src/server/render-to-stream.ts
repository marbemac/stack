import type { RenderToStreamFn } from '@marbemac/server-ssr/server';
import { TwindStream } from '@marbemac/server-twind-stream';
import { uneval } from 'devalue';
import type { RenderToReadableStreamOptions } from 'react-dom/server';
import { renderToReadableStream } from 'react-dom/server';

import { createDataInjector } from './data-injector.ts';
import type { AppPageEvent, ServerEntry } from './types.ts';

export const createRenderToStreamFn =
  ({ streamOptions }: { streamOptions: RenderToReadableStreamOptions }): RenderToStreamFn<AppPageEvent, ServerEntry> =>
  async ({ render, pageEvent, tw }) => {
    const { app, queryClient, trackedQueries, blockingQueries } = await render({ event: pageEvent });

    const appStream = await renderToReadableStream(app, streamOptions);

    const isCrawler = false;
    if (isCrawler) {
      await appStream.allReady;
    }

    return appStream
      .pipeThrough(new TwindStream(tw))
      .pipeThrough(createDataInjector({ blockingQueries, trackedQueries, queryClient, serialize: uneval }));
  };
