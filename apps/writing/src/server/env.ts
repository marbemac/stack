import type { HonoEnv } from './types.js';

export const ENV_VARIABLES_LIST: ReadonlyArray<keyof HonoEnv['Bindings']> = [
  'SQL_URL',
  'AUTH_SECRET',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_SECRET',
] as const;
