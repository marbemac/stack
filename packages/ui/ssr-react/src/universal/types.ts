import type { PageEvent as BasePageEvent } from '@marbemac/server-ssr';
import type { AnyRouter } from '@trpc/server';
import type { Unhead } from '@unhead/schema';

export type PageEvent<TRouter extends AnyRouter = AnyRouter> = BasePageEvent<TRouter> & ExtraPageEventProps;

export type ExtraPageEventProps = {
  head: Unhead;
};
