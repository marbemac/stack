import { type DrizzleToKysely, idCol } from '@marbemac/db-model';
import { type BaseUsersTableCols, type USERS_KEY } from '@marbemac/user-model';
import type { TUserId } from '@marbemac/user-model/ids';
import type { BuildColumns } from 'drizzle-orm';
import { bigint, index, pgTable, text } from 'drizzle-orm/pg-core';

export const USER_SESSIONS_KEY = 'userSessions' as const;
export const USER_SESSIONS_TABLE = 'user_sessions' as const;

export const baseUserSessionCols = {
  id: text('id').primaryKey(),
  userId: idCol<TUserId>()('user_id').notNull(),
  activeExpires: bigint('active_expires', { mode: 'number' }).notNull(),
  idleExpires: bigint('idle_expires', { mode: 'number' }).notNull(),
};

export const baseUserSessionConfig = (
  table: BuildColumns<typeof USER_SESSIONS_TABLE, typeof baseUserSessionCols, 'pg'>,
) => {
  return {
    userIdIdx: index('sessions_user_id_idx').on(table.userId),
  };
};

const baseUserSessions = pgTable(USER_SESSIONS_TABLE, baseUserSessionCols, baseUserSessionConfig);

export type BaseUserSessionsTableCols = DrizzleToKysely<typeof baseUserSessions>;
export type BaseNewUserSession = typeof baseUserSessions.$inferInsert;
export type BaseUserSession = typeof baseUserSessions.$inferSelect;
export type BaseUserSessionColNames = NonNullable<keyof BaseUserSession>;

/** The table we are defining + any other tables in the DB this table must be aware of (for queries, etc) */
export type UserSessionsDb<
  T extends BaseUserSessionsTableCols = BaseUserSessionsTableCols,
  U extends BaseUsersTableCols = BaseUsersTableCols,
> = {
  [USER_SESSIONS_KEY]: T;
  [USERS_KEY]: U;
};
