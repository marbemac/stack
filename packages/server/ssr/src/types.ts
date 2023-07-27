import type { AnyRouter } from '@trpc/server';

/* eslint-disable @typescript-eslint/ban-types */
export type BaseHonoEnv = {
  Bindings: {};
  Variables: {};
};

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

export type PageEvent<TRouter extends AnyRouter = AnyRouter> = {
  url: string; // the whole thing... origin + path + search params, etc
  req: Request;
  responseHeaders: Headers;
  env: Env;
  trpcCaller?: ReturnType<TRouter['createCaller']>;
  setStatusCode(code: number): void;
  getStatusCode(): number;
};

export type ExtendPageEventFnOpts<PE extends PageEvent> = {
  pageEvent: PE;
};
