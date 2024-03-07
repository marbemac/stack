import { Id } from '@marbemac/utils-ids';

export const UserId = Id.dbIdFactory('u');
export type UserNamespace = (typeof UserId)['namespace'];
export type TUserId = ReturnType<(typeof UserId)['generate']>;
