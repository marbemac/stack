import type { DbClient } from '~/db/client.js';

import { postModel } from './posts/model.js';

export type Models = ReturnType<typeof initModels>;

export const initModels = ({ dbClient }: { dbClient: DbClient }) => {
  return {
    _client: dbClient,
    posts: postModel({ dbClient }),
  };
};
