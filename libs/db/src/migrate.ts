import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const migrationClient = postgres('postgres://writing_user:password@localhost:5445/writing', { max: 1 });

await migrate(drizzle(migrationClient), {
  migrationsFolder: 'drizzle',
});
