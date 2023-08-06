import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

export type DbConn = ReturnType<typeof initDbConn>;

export type DbConnOpts = {
  connectionString: string;
};

neonConfig.fetchConnectionCache = true;

neonConfig.fetchEndpoint = host => `https://${host}:${host === 'db.localtest.me' ? 4444 : 443}/sql`;

export const initDbConn = ({ connectionString }: DbConnOpts) => {
  // create the connection
  const sql = neon(connectionString);

  return drizzle(sql);
};
