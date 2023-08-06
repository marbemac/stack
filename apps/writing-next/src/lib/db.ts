import { initDbConn } from '@libs/db';
import { initDbClient } from '@libs/db-model/client';
import { initModels } from '@libs/db-model/models';

const conn = initDbConn({
  connectionString: process.env.SQL_URL,
});
const dbClient = initDbClient({ db: conn });

export const db = initModels({ dbClient });
