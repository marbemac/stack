import { Id } from '@marbemac/utils-ids';

export const PostId = Id.dbIdFactory('p');
export type PostNamespace = (typeof PostId)['namespace'];
export type TPostId = ReturnType<(typeof PostId)['generate']>;
