import { initDbConn } from '@libs/db';
import { initDbClient } from '@libs/db-model/client';
import { initModels } from '@libs/db-model/models';

import type { CreateReqContext } from './types.ts';

export const createReqContext: CreateReqContext = ({ env }) => {
  const db = initDbConn({ filename: env.SQL_URL });
  const dbClient = initDbClient({ db });
  const models = initModels({ dbClient });

  return { models };
};
