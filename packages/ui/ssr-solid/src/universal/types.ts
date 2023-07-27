import type { Manifest, PageEvent as BasePageEvent } from '@marbemac/server-ssr';
import type { RouteDataFunc, RouterOutput } from '@solidjs/router';
import type { AnyRouter } from '@trpc/server';

export type PageEvent<TRouter extends AnyRouter = AnyRouter> = BasePageEvent<TRouter> & ExtraPageEventProps;

export type ExtraPageEventProps = {
  tags: TagDescription[];
  routerContext: RouterOutput;
  routerData?: RouteDataFunc;
};

export interface TagDescription {
  tag: string;
  props: Record<string, unknown>;
  id: string;
  name?: string;
  ref?: Element;
}

declare global {
  interface Env {
    /**
     * BE CAREFUL WHILE USING. AVAILABLE IN PRODUCTION ONLY.
     */
    manifest?: Manifest;
  }
}
