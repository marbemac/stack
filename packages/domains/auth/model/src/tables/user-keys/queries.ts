import type { BuildQueriesOpts } from '@marbemac/db-model';

import type { UserKeysDb } from './schema.ts';

export type BaseUserKeyQueries = ReturnType<typeof baseUserKeyQueries>;

export const baseUserKeyQueries = <T extends UserKeysDb>(opts: Opts<T>) => {
  // const db = opts.db as unknown as Kysely<UserKeysDb>;

  return {};
};

type Opts<T extends UserKeysDb> = BuildQueriesOpts<T>;
