import { TwindStream } from '@marbemac/server-twind-stream';
import { tw } from '@marbemac/ui-twind';
import { Router } from '@solidjs/router';
import { handleFetch$, hasHandler } from '@tanstack/bling/server';
import type { APIContext } from 'astro';
import { manifest } from 'astro:ssr-manifest';
import { renderToStream } from 'solid-js/web';

import { dbClient } from '~/db/client.js';
import { initControllers } from '~/domains/controllers.js';
import { initModels } from '~/domains/models.js';
import { manifestContext } from '~/manifest.js';
import { App } from '~/root.js';
import { reqCtxAls } from '~/utils/req-context.js';

export const requestHandler = async ({ request, ...rest }: APIContext) => {
  const models = initModels({ dbClient });
  const controllers = initControllers({ models });
  const reqCtx = {
    controllers,
    user: null,
  };

  return reqCtxAls.run(reqCtx, () => scopedHandler({ request, ...rest }));
};

const scopedHandler = async ({ request }: APIContext) => {
  if (hasHandler(new URL(request.url).pathname)) {
    return handleFetch$({
      request,
    });
  }

  const responseHeaders = new Headers({
    'Content-Type': 'text/html',
  });

  const render = () => {
    return (
      <manifestContext.Provider value={manifest}>
        <Router url={request.url.toString()}>
          <App />
        </Router>
      </manifestContext.Provider>
    );
  };

  const appStream = renderToStream(() => render());

  const { readable, writable } = new TwindStream(tw);
  appStream.pipeTo(writable);

  return new Response(readable, {
    headers: responseHeaders,
  });
};
