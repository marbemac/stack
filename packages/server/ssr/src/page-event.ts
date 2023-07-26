import type { AnyRouter } from '@trpc/server';

import type { PageEvent } from './types.js';

type CreatePageEventOpts = {
  req: Request;
  env: Env;
  trpcCaller: ReturnType<AnyRouter['createCaller']>;
};

export function createPageEvent<T extends PageEvent>(
  { req, env, trpcCaller }: CreatePageEventOpts,
  extra?: T['extra'],
): Readonly<T> {
  const responseHeaders = new Headers();

  let statusCode = 200;

  function setStatusCode(code: number) {
    statusCode = code;
  }

  function getStatusCode() {
    return statusCode;
  }

  const pageEvent = {
    url: req.url,
    req,
    // will be filled in by the router, if applicable
    routerContext: {} as any,
    // will be filled in by the meta provider, if applicable
    tags: [],
    env,
    responseHeaders,
    setStatusCode: setStatusCode,
    getStatusCode: getStatusCode,
    trpcCaller,
    extra: extra || {},
  } satisfies PageEvent;

  return Object.freeze(pageEvent) as Readonly<T>;
}
