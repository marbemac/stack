import type { PageEvent } from '../universal/index.js';
import { FETCH_EVENT } from '../universal/index.js';

type CreatePageEventOpts = {
  url: string;
  env: Env;
};

export function createPageEvent<T extends PageEvent>(
  { url, env }: CreatePageEventOpts,
  extra?: T['extra'],
): Readonly<T> {
  const responseHeaders = new Headers({
    'content-type': 'text/html',
  });

  let statusCode = 200;

  function setStatusCode(code: number) {
    statusCode = code;
  }

  function getStatusCode() {
    return statusCode;
  }

  return Object.freeze({
    url,
    // will be filled in by the router
    routerContext: {} as any,
    // will be filled in by the meta provider
    tags: [],
    env,
    $type: FETCH_EVENT,
    responseHeaders,
    setStatusCode: setStatusCode,
    getStatusCode: getStatusCode,
    extra,
  }) as Readonly<T>;
}
