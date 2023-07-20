import type { Config } from 'drizzle-kit';

export default {
  schema: '../db-model/src/schema.ts',
  out: 'drizzle',
  dbCredentials: {
    url: process.env['SQL_URL']!,
  },
} satisfies Config;
