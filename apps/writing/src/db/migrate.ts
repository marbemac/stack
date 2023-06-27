import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

import { dbClient } from './client.js';

migrate(dbClient, { migrationsFolder: 'drizzle' });
