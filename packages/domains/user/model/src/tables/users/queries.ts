import type { BaseInsertQueryOpts, BaseSelectQueryOpts, BuildQueriesOpts } from '@marbemac/db-model';
import type { SetOptional } from '@marbemac/utils-types';
import type { Kysely } from 'kysely';

import type { TUserId } from '../../ids.ts';
import { UserId } from '../../ids.ts';
import type { BaseNewUser, BaseUserColNames, UsersDb } from './schema.ts';
import { USERS_KEY } from './schema.ts';

export type BaseUserQueries = ReturnType<typeof baseUserQueries>;

export const baseUserQueries = <T extends UsersDb>(opts: Opts<T>) => {
  const db = opts.db as unknown as Kysely<UsersDb>;

  return {
    byId: userById({ db }),
    byEmail: userByEmail({ db }),
    create: createUser({ db }),
    updateById: updateById({ db }),
    deleteById: deleteById({ db }),
  };
};

type Opts<T extends UsersDb> = BuildQueriesOpts<T>;
type SelectQueryOpts<T extends UsersDb> = BaseSelectQueryOpts<T>;
type InsertQueryOpts<T extends UsersDb> = BaseInsertQueryOpts<T>;

const summarySelect = ['id', 'email', 'name', 'image'] satisfies BaseUserColNames[];
const detailedSelect = [...summarySelect, 'emailVerified', 'email'] satisfies BaseUserColNames[];

const userById = ({ db }: SelectQueryOpts<UsersDb>) => {
  return (params: { id: TUserId }, { withPassword }: { withPassword?: boolean } = {}) =>
    db
      .selectFrom(USERS_KEY)
      .select(detailedSelect)
      .$if(!!withPassword, qb => qb.select(['password', 'passwordHasher']))
      .where('id', '=', params.id)
      .executeTakeFirst();
};

const userByEmail = ({ db }: SelectQueryOpts<UsersDb>) => {
  return (params: { email: string }, { withPassword }: { withPassword?: boolean } = {}) =>
    db
      .selectFrom(USERS_KEY)
      .select(detailedSelect)
      .$if(!!withPassword, qb => qb.select(['password', 'passwordHasher']))
      .where('email', '=', params.email.toLowerCase())
      .executeTakeFirst();
};

const createUser = ({ db }: InsertQueryOpts<UsersDb>) => {
  return (values: SetOptional<BaseNewUser, 'id'>) => {
    return db
      .insertInto(USERS_KEY)
      .values({
        id: UserId.generate(),
        ...values,
      })
      .returningAll()
      .executeTakeFirstOrThrow();
  };
};

const updateById = ({ db }: InsertQueryOpts<UsersDb>) => {
  return (where: { id: TUserId }, values: Partial<BaseNewUser>) => {
    return db.updateTable(USERS_KEY).set(values).where('id', '=', where.id).returningAll().executeTakeFirstOrThrow();
  };
};

const deleteById = ({ db }: InsertQueryOpts<UsersDb>) => {
  return (where: { id: TUserId }) => {
    return db.deleteFrom(USERS_KEY).where('id', '=', where.id).executeTakeFirst();
  };
};
