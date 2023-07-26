import { createApp } from '@marbemac/server-ssr';

import { registerProdApp } from './register-prod-app.ts';
import type { HonoEnv } from './types.ts';

const app = createApp<HonoEnv>();

registerProdApp({ app });

export default app;
