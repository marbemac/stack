import type { ExtendPageEventFnOpts, PageEvent as BasePageEvent } from '@marbemac/server-ssr';

import type { ExtraPageEventProps } from '../index.js';

export type ExtendedPageEvent<BPE extends BasePageEvent> = BPE & ExtraPageEventProps;

export const extendPageEvent = <PE extends BasePageEvent>({
  pageEvent: basePageEvent,
}: ExtendPageEventFnOpts<PE>): ExtendedPageEvent<PE> => {
  const pageEvent = {
    ...basePageEvent,
    tags: [],
    routerContext: {} as any,
  } satisfies ExtendedPageEvent<PE>;

  return Object.freeze(pageEvent);
};
