import { customType, timestamp } from 'drizzle-orm/pg-core';

/**
 * Typed id column.
 *
 * @example
 * const columns = {
 *   id: idColumn<TOrgId>()('id').primaryKey(),
 * }
 */
export const idCol = <Type extends string>() => {
  return customType<{ data: Type }>({
    dataType() {
      return 'text';
    },
  });
};

/**
 * @example
 * const columns = {
 *   createdAt: timestampCol('created_at').notNull().defaultNow(),
 *   updatedAt: timestampCol('updated_at').defaultNow(),
 * }
 */
export const timestampCol = <TName extends string>(dbName: TName) =>
  timestamp(dbName, { withTimezone: true, mode: 'date' });
