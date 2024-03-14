import type {
  BaseInsertQueryOpts,
  BaseSelectQueryOpts,
  BaseUpdateQueryOpts,
  BuildQueriesOpts,
} from '@marbemac/db-model';
import type { TOrgId } from '@marbemac/org-model/ids';
import { dayjs } from '@marbemac/utils-dates';
import { type Kysely, sql } from 'kysely';

import type { TJobRunId } from '../../ids.ts';
import { JobRunId } from '../../ids.ts';
import type { BaseJobRunColNames, BaseNewJobRun, JobRunLog, JobRunsDb, UpdateableJobRun } from './schema.ts';
import { JOB_RUNS_KEY } from './schema.ts';

export type BaseJobRunQueries = ReturnType<typeof baseJobRunQueries>;

export const baseJobRunQueries = <T extends JobRunsDb>(opts: Opts<T>) => {
  const db = opts.db as unknown as Kysely<JobRunsDb>;

  return {
    byId: byId({ db }),
    create: create({ db }),
    updateById: updateById({ db }),
    byLookupKeyAndGroupedSubkeys: latestSubkeysByLookupKey({ db }),
    appendLogs: appendLogs({ db }),
    logs: logsById({ db }),
  };
};

type Opts<T extends JobRunsDb> = BuildQueriesOpts<T>;
type SelectQueryOpts<T extends JobRunsDb> = BaseSelectQueryOpts<T>;
type UpdateQueryOpts<T extends JobRunsDb> = BaseUpdateQueryOpts<T>;
type InsertQueryOpts<T extends JobRunsDb> = BaseInsertQueryOpts<T>;

export const summarySelect = [
  'id',
  'orgId',
  'lookupKey',
  'lookupSubkey',
  'actorType',
  'actorId',
  'title',
  'task',
  'status',
  'createdAt',
  'updatedAt',
  'startedAt',
  'completedAt',
] satisfies BaseJobRunColNames[];

export const detailedSelect = [...summarySelect, 'state', 'payload'] satisfies BaseJobRunColNames[];

const byId = ({ db }: SelectQueryOpts<JobRunsDb>) => {
  return (params: { id: TJobRunId }) =>
    db.selectFrom(JOB_RUNS_KEY).select(detailedSelect).where('id', '=', params.id).executeTakeFirstOrThrow();
};

const appendLogs = ({ db }: SelectQueryOpts<JobRunsDb>) => {
  return ({ id, logs }: { id: TJobRunId; logs: JobRunLog[] }) => {
    return db
      .updateTable(JOB_RUNS_KEY)
      .set(({ eb }) => ({
        logs: eb(
          'logs',
          '||',
          // @ts-expect-error ignore.. column is jsonb, so stringifying it here is OK. Kysely doesn't handle arrays well in this use case.
          JSON.stringify(logs),
        ),
      }))
      .where('id', '=', id)
      .execute();
  };
};

const logsById = ({ db }: SelectQueryOpts<JobRunsDb>) => {
  return ({ id, updatedSince }: { id: TJobRunId; updatedSince?: string | number | Date }) => {
    let q = db
      .selectFrom([
        `${JOB_RUNS_KEY} as jr`,
        sql<JobRunLog>`jsonb_to_recordset(logs)`.as<'l'>(sql`l(lvl int, msg text, ext jsonb, ts bigint)`),
      ])
      .select(['l.ts', 'l.lvl', 'l.msg', 'l.ext'])
      .orderBy('l.ts desc')
      .where('jr.id', '=', id);

    if (updatedSince) {
      q = q.where('l.ts', '>=', dayjs.utc(updatedSince).unix());
    }

    return q.execute();
  };
};

/**
 * This query is used to find the latest job run(s) for a given lookup key, grouped by subkey.
 *
 * For example if the lookup key is an integration ID, and the subkey is an action ID, this query
 * will retrieve the latest job run(s) for each action of the integration.
 */
const latestSubkeysByLookupKey = ({ db }: SelectQueryOpts<JobRunsDb>) => {
  return (params: { orgId: TOrgId; lookupKey: string; maxPerSubkey?: number; updatedSince?: string | number | Date }) =>
    db
      .selectFrom(eb => {
        let sub = eb
          .selectFrom(JOB_RUNS_KEY)
          .select(summarySelect)
          .select(
            sql<number>`ROW_NUMBER() OVER (PARTITION BY org_id, lookup_key, lookup_subkey ORDER BY created_at DESC)`.as(
              'rownum',
            ),
          )
          .where('orgId', '=', params.orgId)
          .where('lookupKey', '=', params.lookupKey);

        if (params.updatedSince) {
          sub = sub.where('updatedAt', '>=', dayjs.utc(params.updatedSince).toDate());
        }

        return sub.as('j');
      })
      .selectAll()
      .where('rownum', '<=', params.maxPerSubkey || 1)
      .execute();
};

const create = ({ db }: InsertQueryOpts<JobRunsDb>) => {
  return (values: BaseNewJobRun) => {
    return db
      .insertInto(JOB_RUNS_KEY)
      .values({
        id: JobRunId.generate(),
        ...values,
      })
      .returning('id')
      .executeTakeFirstOrThrow();
  };
};

const updateById = ({ db }: UpdateQueryOpts<JobRunsDb>) => {
  return ({ id, values }: { id: TJobRunId; values: UpdateableJobRun }) => {
    return db
      .updateTable(JOB_RUNS_KEY)
      .set({ updatedAt: new Date(), ...values })
      .where('id', '=', id)
      .execute();
  };
};
