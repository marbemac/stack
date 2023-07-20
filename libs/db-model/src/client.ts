import type { DbConn } from '@libs/db';

import { postClient } from './posts/client.ts';

export type DbClient = ReturnType<typeof initDbClient>;

export const initDbClient = ({ db }: { db: DbConn }) => {
  return {
    _conn: db,
    posts: postClient({ db }),
  };
};
