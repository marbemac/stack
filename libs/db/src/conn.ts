import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';

export type DbConn = ReturnType<typeof initDbConn>;

export type DbConnOpts = {
  filename: string;
};

export const initDbConn = ({ filename }: DbConnOpts) => {
  // create the connection
  const betterSqlite = new Database(filename);

  return drizzle(betterSqlite);
};
