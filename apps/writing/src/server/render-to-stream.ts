import type { RenderToStreamFn } from '@marbemac/server-ssr';
import { TwindStream } from '@marbemac/server-twind-stream';
import { renderToStream as renderSolidStream } from 'solid-js/web';

import type { AppPageEvent, ServerEntry } from './types.ts';

export const renderToStream: RenderToStreamFn<AppPageEvent, ServerEntry> = async ({ render, pageEvent, tw }) => {
  const { readable, writable } = new TwindStream(tw);

  const appStream = renderSolidStream(() => render({ event: pageEvent }));

  appStream.pipeTo(writable);

  return readable;
};
