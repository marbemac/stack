import type { AnyRouter } from '@trpc/server';

import type { PageEvent } from './types.js';

type CreatePageEventOpts = {
  req: Request;
  env: Env;
  trpcCaller: ReturnType<AnyRouter['createCaller']>;
};

export function createPageEvent({ req, env, trpcCaller }: CreatePageEventOpts): Readonly<PageEvent> {
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
    env,
    responseHeaders,
    setStatusCode: setStatusCode,
    getStatusCode: getStatusCode,
    trpcCaller,
  } satisfies PageEvent;

  return Object.freeze(pageEvent);
}
