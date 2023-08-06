import type { Config } from 'drizzle-kit';

export default {
  schema: '../db-model/src/schema.ts',
  out: 'drizzle',
  dbCredentials: {
    // url: process.env['SQL_URL']!,
    url: 'postgres://writing_user:password@localhost:5445/writing',
  },
} satisfies Config;
