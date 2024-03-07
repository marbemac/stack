import type { BaseInsertQueryOpts, BaseSelectQueryOpts, BuildQueriesOpts } from '@marbemac/db-model';
import type { Kysely } from 'kysely';

import { OrgId } from '../../ids.ts';
import type { BaseNewOrg, BaseOrgColNames, OrgsDb } from './schema.ts';
import { ORGS_KEY } from './schema.ts';

export type BaseOrgQueries = ReturnType<typeof baseOrgQueries>;

export const baseOrgQueries = <T extends OrgsDb>(opts: Opts<T>) => {
  const db = opts.db as unknown as Kysely<OrgsDb>;

  return {
    bySlug: orgBySlug({ db }),
    listForUser: orgsForUser({ db }),
    create: createOrg({ db }),
    bulkUpsert: bulkUpsertOrg({ db }),
  };
};

type Opts<T extends OrgsDb> = BuildQueriesOpts<T>;
type SelectQueryOpts<T extends OrgsDb> = BaseSelectQueryOpts<T>;
type InsertQueryOpts<T extends OrgsDb> = BaseInsertQueryOpts<T>;

const summarySelect = ['id', 'slug', 'createdAt'] satisfies BaseOrgColNames[];
const detailedSelect = [...summarySelect] satisfies BaseOrgColNames[];

const orgBySlug = ({ db }: SelectQueryOpts<OrgsDb>) => {
  return (params: { slug: string }) =>
    db.selectFrom(ORGS_KEY).select(summarySelect).where('slug', '=', params.slug).executeTakeFirst();
};

const orgsForUser = ({ db }: SelectQueryOpts<OrgsDb>) => {
  return () => db.selectFrom(ORGS_KEY).select(detailedSelect).execute();
};

const createOrg = ({ db }: InsertQueryOpts<OrgsDb>) => {
  return (values: BaseNewOrg) => {
    return db
      .insertInto(ORGS_KEY)
      .values({
        id: OrgId.generate(),
        ...values,
      })
      .returningAll()
      .executeTakeFirstOrThrow();
  };
};

const bulkUpsertOrg = ({ db }: InsertQueryOpts<OrgsDb>) => {
  return (values: BaseNewOrg[]) => {
    if (!values.length) return [];

    return db
      .insertInto(ORGS_KEY)
      .values(
        values.map(v => ({
          id: OrgId.generate(),
          ...v,
        })),
      )
      .onConflict(oc => oc.doNothing())
      .returning('id')
      .execute();
  };
};
