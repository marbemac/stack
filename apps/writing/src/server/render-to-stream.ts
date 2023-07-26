import type { RenderToStreamFn } from '@marbemac/server-ssr/server';
import { TwindStream } from '@marbemac/server-twind-stream';
import { renderToStream } from 'solid-js/web';

import type { AppPageEvent, ServerEntry } from './types.ts';

export const createRenderToStreamFn =
  (): RenderToStreamFn<AppPageEvent, ServerEntry> =>
  async ({ render, pageEvent, tw }) => {
    const { readable, writable } = new TwindStream(tw);

    const appStream = renderToStream(() => render({ event: pageEvent }).app);

    appStream.pipeTo(writable);

    return readable;
  };
