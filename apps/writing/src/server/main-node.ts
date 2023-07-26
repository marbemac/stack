import { createAdaptorServer, serveStatic } from '@marbemac/server-hono-node';
import { createApp } from '@marbemac/server-ssr';

import { registerProdApp } from './register-prod-app.ts';
import type { HonoEnv } from './types.ts';

const port = Number(process.env['PORT'] || 3001);

const app = createApp<HonoEnv>();

app.use('/assets/*', serveStatic({ root: './dist' }));
app.use('/favicon.ico', serveStatic({ root: './dist' }));

registerProdApp({ app });

const server = createAdaptorServer({
  ...app,
  fetch: req => {
    return app.fetch(req, process.env);
  },
});

server.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server started on port ${port}`);
});
