import { createApp } from '@marbemac/server-ssr/server';

import { registerProdApp } from './register-prod-app.ts';
import type { HonoEnv } from './types.ts';

const app = createApp<HonoEnv>();

registerProdApp({ app });

export default app;
