import type { RouteDataFunc, RouterOutput } from '@solidjs/router';

export type ManifestId = string;

export type ManifestEntry = {
  file: string;
  isEntry?: boolean;
  imports?: ManifestId[];
};

export type Manifest = Record<ManifestId, ManifestEntry>;

export const FETCH_EVENT = '$FETCH';

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

export type PageEvent<T extends Record<string, unknown> = Record<string, unknown>> = {
  url: string; // the whole thing... origin + path + search params, etc
  responseHeaders: Headers;
  tags: TagDescription[];
  env: Env;
  routerContext?: RouterOutput;
  routerData?: RouteDataFunc;
  setStatusCode(code: number): void;
  getStatusCode(): number;
  $type: typeof FETCH_EVENT;
  extra: T;
};
