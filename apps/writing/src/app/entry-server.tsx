import { Router } from '@solidjs/router';
import { handleFetch$, hasHandler } from '@tanstack/bling/server';
import type { APIContext } from 'astro';
import { manifest } from 'astro:ssr-manifest';
import { renderToStringAsync } from 'solid-js/web';

import { dbClient } from '~/db/client.js';
import { initControllers } from '~/domains/controllers.js';
import { initModels } from '~/domains/models.js';
import { reqCtxAls } from '~/utils/req-context.js';

import { manifestContext } from './manifest.js';
import { App } from './root.js';

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

  return new Response(
    await renderToStringAsync(() => {
      return (
        <manifestContext.Provider value={manifest}>
          <Router url={request.url.toString()}>
            <App />
          </Router>
        </manifestContext.Provider>
      );
    }),
    {
      headers: {
        'content-type': 'text/html',
      },
    },
  );
};
