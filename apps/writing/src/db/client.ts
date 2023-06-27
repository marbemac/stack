import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';

// create the connection
const betterSqlite = new Database('data.db');

export const dbClient = drizzle(betterSqlite);

export type DbClient = typeof dbClient;
