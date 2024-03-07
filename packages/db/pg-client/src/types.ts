import type { Kysely } from 'kysely';
import type { Sql } from 'postgres';

type BaseInitClientOpts = {
  debug?: boolean;

  /**
   * Re-use existing client, if one was created previously.
   * Only applicable in the edge client, and usually you will not want this.
   */
  reuse?: boolean;
};

export type InitClientOptsWithUri = BaseInitClientOpts & {
  uri: string;

  /**
   * Max connections, for the clients that support it.
   */
  max?: number;
};

export type InitClientOptsWithSql = BaseInitClientOpts & {
  sql: Sql;
};

export type InitClientOpts = InitClientOptsWithUri | InitClientOptsWithSql;

export interface PgClient<T> {
  db: Kysely<T>;
  sql: Sql;
}

export type InitClientFn = <T>(opts: InitClientOpts) => PgClient<T>;
