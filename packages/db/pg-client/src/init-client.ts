import { CamelCasePlugin, Kysely } from 'kysely';
import { PostgresJSDialect } from 'kysely-postgres-js';
import postgres from 'postgres';

import type { InitClientFn, InitClientOpts, InitClientOptsWithSql, PgClient } from './types.ts';

let client: PgClient<any>;

export const initClient: InitClientFn = <DB>(opts: InitClientOpts): PgClient<DB> => {
  const { debug, reuse } = opts;
  if (client && reuse) {
    return client as PgClient<DB>;
  }

  const sql = isInitClientOptsWithSql(opts) ? opts.sql : postgres(opts.uri, { max: opts.max });

  const db = new Kysely<DB>({
    plugins: [new CamelCasePlugin()],
    log: debug ? ['query', 'error'] : ['error'],
    dialect: new PostgresJSDialect({
      postgres: sql,
    }),
  });

  client = { db, sql };

  return client as PgClient<DB>;
};

const isInitClientOptsWithSql = (opts: InitClientOpts): opts is InitClientOptsWithSql => {
  return (opts as InitClientOptsWithSql).sql !== undefined;
};
