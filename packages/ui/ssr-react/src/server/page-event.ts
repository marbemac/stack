import type { ExtendPageEventFnOpts, PageEvent as BasePageEvent } from '@marbemac/server-ssr';

import type { ExtraPageEventProps } from '../index.js';
import { createHead } from '../universal/head.js';

export type ExtendedPageEvent<BPE extends BasePageEvent> = BPE & ExtraPageEventProps;

export const extendPageEvent = <PE extends BasePageEvent>({
  pageEvent: basePageEvent,
}: ExtendPageEventFnOpts<PE>): ExtendedPageEvent<PE> => {
  const head = createHead();

  const pageEvent = {
    ...basePageEvent,
    head,
  } satisfies ExtendedPageEvent<PE>;

  return Object.freeze(pageEvent);
};
