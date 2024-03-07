import type { BuildQueriesOpts } from '@marbemac/db-model';

import type { UserSessionsDb } from './schema.ts';

export type BaseUserSessionQueries = ReturnType<typeof baseUserSessionQueries>;

export const baseUserSessionQueries = <T extends UserSessionsDb>(opts: Opts<T>) => {
  // const db = opts.db as unknown as Kysely<UserSessionsDb>;

  return {};
};

type Opts<T extends UserSessionsDb> = BuildQueriesOpts<T>;
