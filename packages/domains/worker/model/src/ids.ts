import { Id } from '@marbemac/utils-ids';

export const JobRunId = Id.dbIdFactory('job', 22);
export type JobRunNamespace = (typeof JobRunId)['namespace'];
export type TJobRunId = ReturnType<(typeof JobRunId)['generate']>;
