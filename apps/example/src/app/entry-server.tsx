import { Router, useRoutes } from '@solidjs/router';
import { handleFetch$, hasHandler } from '@tanstack/bling/server';
import type { APIContext } from 'astro';
import { manifest } from 'astro:ssr-manifest';
import { renderToStringAsync } from 'solid-js/web';

import { manifestContext } from './manifest.js';
import { routes } from './root.js';

export const requestHandler = async ({ request }: APIContext) => {
  if (hasHandler(new URL(request.url).pathname)) {
    return handleFetch$({
      request,
    });
  }

  return new Response(
    await renderToStringAsync(() => {
      const Routes = useRoutes(routes);
      return (
        <manifestContext.Provider value={manifest}>
          <Router url={request.url.toString()}>
            <Routes />
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
