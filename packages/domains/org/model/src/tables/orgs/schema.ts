import type { DrizzleToKysely } from '@marbemac/db-model';
import { idCol, timestampCol } from '@marbemac/db-model';
import type { SetOptional } from '@marbemac/utils-types';
import type { BuildColumns } from 'drizzle-orm';
import { pgTable, text } from 'drizzle-orm/pg-core';

import type { TOrgId } from '../../ids.ts';

export const ORGS_KEY = 'orgs' as const;
export const ORGS_TABLE = 'orgs' as const;

export const baseOrgCols = {
  id: idCol<TOrgId>()('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  createdAt: timestampCol('created_at').notNull().defaultNow(),
  updatedAt: timestampCol('updated_at').defaultNow(),
};

export const baseOrgConfig = (table: BuildColumns<typeof ORGS_TABLE, typeof baseOrgCols, 'pg'>) => {
  return {};
};

const baseOrgs = pgTable(ORGS_TABLE, baseOrgCols, baseOrgConfig);

export type BaseOrgsTableCols = DrizzleToKysely<typeof baseOrgs>;
export type BaseNewOrg = SetOptional<typeof baseOrgs.$inferInsert, 'id'>;
export type BaseOrg = typeof baseOrgs.$inferSelect;
export type BaseOrgColNames = NonNullable<keyof BaseOrg>;

/** The table we are defining + any other tables in the DB this table must be aware of (for queries, etc) */
export interface OrgsDb<T extends BaseOrgsTableCols = BaseOrgsTableCols> {
  [ORGS_KEY]: T;
}