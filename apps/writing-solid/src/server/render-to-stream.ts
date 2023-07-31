import type { RenderToStreamFn } from '@marbemac/server-ssr';
import { TwindStream } from '@marbemac/server-twind-stream';
import { renderToStream as renderSolidStream } from 'solid-js/web';

import type { AppPageEvent, ServerEntry } from './types.ts';

export const renderToStream: RenderToStreamFn<AppPageEvent, ServerEntry> = async ({ render, pageEvent }) => {
  const { readable, writable } = new TwindStream(pageEvent.twind.tw);

  const appStream = renderSolidStream(() => render({ pageEvent }));

  appStream.pipeTo(writable);

  return readable;
};
