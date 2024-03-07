import { type DrizzleToKysely, idCol } from '@marbemac/db-model';
import type { BaseUsersTableCols, USERS_KEY } from '@marbemac/user-model';
import type { TUserId } from '@marbemac/user-model/ids';
import type { BuildColumns } from 'drizzle-orm';
import { index, pgTable, text } from 'drizzle-orm/pg-core';

export const USER_KEYS_KEY = 'userKeys' as const;
export const USER_KEYS_TABLE = 'user_keys' as const;

export const baseUserKeyCols = {
  id: text('id').primaryKey(),
  userId: idCol<TUserId>()('user_id').notNull(),
  hashedPassword: text('hashed_password'),
};

export const baseUserKeyConfig = (table: BuildColumns<typeof USER_KEYS_TABLE, typeof baseUserKeyCols, 'pg'>) => {
  return {
    userIdIdx: index('user_keys_user_id_idx').on(table.userId),
  };
};

const baseUserKeys = pgTable(USER_KEYS_TABLE, baseUserKeyCols, baseUserKeyConfig);

export type BaseUserKeysTableCols = DrizzleToKysely<typeof baseUserKeys>;
export type BaseNewUserKey = typeof baseUserKeys.$inferInsert;
export type BaseUserKey = typeof baseUserKeys.$inferSelect;
export type BaseUserKeyColNames = NonNullable<keyof BaseUserKey>;

/** The table we are defining + any other tables in the DB this table must be aware of (for queries, etc) */
export type UserKeysDb<
  T extends BaseUserKeysTableCols = BaseUserKeysTableCols,
  U extends BaseUsersTableCols = BaseUsersTableCols,
> = {
  [USER_KEYS_KEY]: T;
  [USERS_KEY]: U;
};
