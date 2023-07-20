import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

import { initDbConn } from './conn.ts';

await migrate(initDbConn({ filename: '../../data.db' }), { migrationsFolder: 'drizzle' });
