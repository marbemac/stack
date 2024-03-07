import { Id } from '@marbemac/utils-ids';

export const JobRunId = Id.dbIdFactory('jr');
export type JobRunNamespace = (typeof JobRunId)['namespace'];
export type TJobRunId = ReturnType<(typeof JobRunId)['generate']>;
