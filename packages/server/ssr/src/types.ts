// import type { RouteDataFunc, RouterOutput } from '@solidjs/router';

import type { AnyRouter } from '@trpc/server';

export type ManifestId = string;

export type ManifestEntry = {
  file: string;
  isEntry?: boolean;
  imports?: ManifestId[];
};

export type Manifest = Record<ManifestId, ManifestEntry>;

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

export type PageEvent<
  TRouter extends AnyRouter = AnyRouter,
  T extends Record<string, unknown> = Record<string, unknown>,
> = {
  url: string; // the whole thing... origin + path + search params, etc
  req: Request;
  responseHeaders: Headers;
  tags: TagDescription[];
  env: Env;
  routerContext?: unknown;
  routerData?: unknown;
  trpcCaller?: ReturnType<TRouter['createCaller']>;
  setStatusCode(code: number): void;
  getStatusCode(): number;
  extra: T;
};
