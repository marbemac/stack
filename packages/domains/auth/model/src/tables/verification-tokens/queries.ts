import type { BaseInsertQueryOpts, BaseSelectQueryOpts, BuildQueriesOpts } from '@marbemac/db-model';
import type { TUserId } from '@marbemac/user-model/ids';
import type { Kysely } from 'kysely';

import type { BaseNewVerificationToken, BaseVerificationTokenColNames, VerificationTokenPurpose } from './schema.ts';
import { VERIFICATION_TOKENS_KEY, type VerificationTokensDb } from './schema.ts';

export type BaseVerificationTokenQueries = ReturnType<typeof baseVerificationTokenQueries>;

export const baseVerificationTokenQueries = <T extends VerificationTokensDb>(opts: Opts<T>) => {
  const db = opts.db as unknown as Kysely<VerificationTokensDb>;

  return {
    byToken: byToken({ db }),
    listByUserId: listByUserId({ db }),
    create: create({ db }),
    deleteForUser: deleteForUser({ db }),
  };
};

type Opts<T extends VerificationTokensDb> = BuildQueriesOpts<T>;
type SelectQueryOpts<T extends VerificationTokensDb> = BaseSelectQueryOpts<T>;
type InsertQueryOpts<T extends VerificationTokensDb> = BaseInsertQueryOpts<T>;

const summarySelect = ['token', 'userId', 'expiresAt'] satisfies BaseVerificationTokenColNames[];
const detailedSelect = [...summarySelect, 'token', 'purpose'] satisfies BaseVerificationTokenColNames[];

const byToken = ({ db }: SelectQueryOpts<VerificationTokensDb>) => {
  return ({ token, purpose }: { token: string; purpose: VerificationTokenPurpose }) =>
    db
      .selectFrom(VERIFICATION_TOKENS_KEY)
      .select(summarySelect)
      .where('token', '=', token)
      .where('purpose', '=', purpose)
      .executeTakeFirst();
};

const listByUserId = ({ db }: SelectQueryOpts<VerificationTokensDb>) => {
  return ({ userId, purpose }: { userId: TUserId; purpose: VerificationTokenPurpose }) =>
    db
      .selectFrom(VERIFICATION_TOKENS_KEY)
      .select(summarySelect)
      .where('userId', '=', userId)
      .where('purpose', '=', purpose)
      .execute();
};

const create = ({ db }: InsertQueryOpts<VerificationTokensDb>) => {
  return (values: BaseNewVerificationToken) => {
    return db
      .insertInto(VERIFICATION_TOKENS_KEY)
      .values({
        ...values,
      })
      .executeTakeFirstOrThrow();
  };
};

const deleteForUser = ({ db }: InsertQueryOpts<VerificationTokensDb>) => {
  return ({ userId, purpose }: { userId: TUserId; purpose: VerificationTokenPurpose }) => {
    return db.deleteFrom(VERIFICATION_TOKENS_KEY).where('userId', '=', userId).where('purpose', '=', purpose).execute();
  };
};
