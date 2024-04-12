import { type DrizzleToKysely, idCol, timestampCol } from '@marbemac/db-model';
import type { TOrgId } from '@marbemac/org-model/ids';
import type { TUserId } from '@marbemac/user-model/ids';
import type { SetOptional } from '@marbemac/utils-types';
import type { BuildColumns } from 'drizzle-orm';
import { index, jsonb, pgTable, text } from 'drizzle-orm/pg-core';
import type { Updateable } from 'kysely';

import type { TJobRunId } from '../../ids.ts';
import type { detailedSelect, summarySelect } from './queries.ts';

export const JOB_RUNS_KEY = 'jobRuns' as const;
export const JOB_RUNS_TABLE = 'job_runs' as const;

export type JobRunActorType = 'user';
export type JobRunStatus = 'pending' | 'queued' | 'failed' | 'success' | 'started' | 'canceled' | 'timed_out';

export enum JobRunLogLevel {
  critical = 2,
  error = 3,
  warning = 4,
  notice = 5,
  info = 6,
  debug = 7,
}

export interface JobRunLog {
  ts: number; // unix timestamp (milliseconds)
  lvl: JobRunLogLevel;
  msg: string;
  ext: string; // optional extra key/val pairs related to the log
}

export const baseJobRunCols = {
  id: idCol<TJobRunId>()('id').primaryKey(),

  orgId: idCol<TOrgId>()('org_id').notNull(),

  lookupKey: text('lookup_key').notNull(),
  lookupSubkey: text('lookup_subkey'),

  // the graphile-worker jobs.id, if applicable
  workerJobId: text('worker_job_id'),

  actorType: text('actor_type').$type<JobRunActorType>().notNull(),
  actorId: idCol<TUserId | string>()('actor_id'),

  title: text('title'),
  task: text('task').notNull(),
  status: text('status').$type<JobRunStatus>().notNull(),
  payload: jsonb('payload').$type<Record<string, unknown>>().default({}).notNull(),
  state: jsonb('state').$type<Record<string, unknown>>().default({}).notNull(),
  last_error: text('last_error'),

  logs: jsonb('logs').$type<JobRunLog[]>().default([]).notNull(),

  createdAt: timestampCol('created_at').defaultNow().notNull(),
  updatedAt: timestampCol('updated_at').defaultNow().notNull(),

  startedAt: timestampCol('started_at'),
  completedAt: timestampCol('completed_at'),
};

export const baseJobRunConfig = (table: BuildColumns<typeof JOB_RUNS_TABLE, typeof baseJobRunCols, 'pg'>) => {
  return {
    orgLookupKeyIdx: index('job_runs_org_lookup_key_idx').on(table.orgId, table.lookupKey, table.lookupSubkey),

    // index on logs.created_at jsonb prop - not supported atm by drizzle
    // logsCreatedIdx: index('job_runs_logs_created_at_idx').on(`job_runs((logs --> 'created_at'))`),
  };
};

const baseJobRuns = pgTable(JOB_RUNS_TABLE, baseJobRunCols, baseJobRunConfig);

export type BaseJobRunsTableCols = DrizzleToKysely<typeof baseJobRuns>;
export type BaseNewJobRun = SetOptional<typeof baseJobRuns.$inferInsert, 'id'>;
export type UpdateableJobRun = Updateable<BaseJobRunsTableCols>;
export type BaseJobRun = typeof baseJobRuns.$inferSelect;
export type BaseJobRunColNames = NonNullable<keyof BaseJobRun>;
export type BaseJobRunSummary = Pick<BaseJobRun, (typeof summarySelect)[number]>;
export type BaseJobRunDetailed = Pick<BaseJobRun, (typeof detailedSelect)[number]>;

/** The table we are defining + any other tables in the DB this table must be aware of (for queries, etc) */
export interface JobRunsDb<T extends BaseJobRunsTableCols = BaseJobRunsTableCols> {
  [JOB_RUNS_KEY]: T;
}
