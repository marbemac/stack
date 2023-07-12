import { TwindStream } from '@marbemac/server-twind-stream';
import { createPageEvent, render } from '@marbemac/ui-solid-js/server';
import { tw } from '@marbemac/ui-twind';
import { handleFetch$, hasHandler } from '@tanstack/bling/server';
import type { APIContext } from 'astro';
import { manifest } from 'astro:ssr-manifest';
import { renderToStream } from 'solid-js/web';

import { dbClient } from '~/db/client.js';
import { initControllers } from '~/domains/controllers.js';
import { initModels } from '~/domains/models.js';
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
  // console.log('MANIFEST', JSON.stringify(manifest, null, 4));

  if (hasHandler(new URL(request.url).pathname)) {
    return handleFetch$({ request });
  }

  const pageEvent = createPageEvent({ url: request.url, env: { manifest } });

  const appStream = renderToStream(() => render({ event: pageEvent, Root: App }));

  const { readable, writable } = new TwindStream(tw);
  appStream.pipeTo(writable);

  // const render = () => {
  //   return (
  //     <manifestContext.Provider value={manifest}>
  //       <Router url={request.url.toString()}>
  //         <App />
  //       </Router>
  //     </manifestContext.Provider>
  //   );
  // };

  return new Response(readable, {
    headers: pageEvent.responseHeaders,
    status: pageEvent.getStatusCode(),
  });
};
