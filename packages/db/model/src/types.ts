import type { CamelCasedProperties } from '@marbemac/utils-types';
import type { Table } from 'drizzle-orm';
import type { Kyselify } from 'drizzle-orm/kysely';
import type { Kysely } from 'kysely';

export interface BuildQueriesOpts<DB> {
  db: Kysely<DB>;
}

export type BaseQueryOpts<DB> = Pick<BuildQueriesOpts<DB>, 'db'>;
export type BaseSelectQueryOpts<DB> = BaseQueryOpts<DB>;
export type BaseInsertQueryOpts<DB> = BaseQueryOpts<DB>;
export type BaseUpdateQueryOpts<DB> = BaseQueryOpts<DB>;
export type BaseDeleteQueryOpts<DB> = BaseQueryOpts<DB>;

export type DrizzleToKysely<T extends Table> = CamelCasedProperties<Kyselify<T>>;
