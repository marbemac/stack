import type { DrizzleToKysely } from '@marbemac/db-model';
import { timestampCol } from '@marbemac/db-model';
import type { BuildExtraConfigColumns } from 'drizzle-orm';
import { pgTable, text } from 'drizzle-orm/pg-core';

import type { TUserId } from '../../ids.ts';

export const USERS_KEY = 'users' as const;
export const USERS_TABLE = 'users' as const;

export const baseUserCols = {
  id: text('id').$type<TUserId>().primaryKey(),

  email: text('email').notNull().unique(),
  emailVerifiedAt: timestampCol('email_verified_at'),

  name: text('name'),
  image: text('image'),
  password: text('password'),
  passwordHasher: text('password_hasher'),

  createdAt: timestampCol('created_at').notNull().defaultNow(),
  updatedAt: timestampCol('updated_at').defaultNow(),
};

export const baseUserConfig = (table: BuildExtraConfigColumns<typeof USERS_TABLE, typeof baseUserCols, 'pg'>) => {
  return [];
};

const baseUsers = pgTable(USERS_TABLE, baseUserCols, baseUserConfig);

export type BaseUsersTableCols = DrizzleToKysely<typeof baseUsers>;
export type BaseNewUser = typeof baseUsers.$inferInsert;
export type BaseUser = typeof baseUsers.$inferSelect;
export type BaseUserColNames = NonNullable<keyof BaseUser>;

/** The table we are defining + any other tables in the DB this table must be aware of (for queries, etc) */
export interface UsersDb<T extends BaseUsersTableCols = BaseUsersTableCols> {
  [USERS_KEY]: T;
}
