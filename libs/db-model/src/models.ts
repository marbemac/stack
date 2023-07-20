import type { DbClient } from './client.ts';
import { postModel } from './posts/model.ts';

export type Models = ReturnType<typeof initModels>;

export const initModels = ({ dbClient }: { dbClient: DbClient }) => {
  return {
    posts: postModel({ dbClient }),
  };
};
