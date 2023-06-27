import { sql } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import { boolean, integer, table, text } from '~/db/builder.js';

import { KEY_PLURAL } from './consts.js';

export const posts = table(KEY_PLURAL, {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  content: text('content').notNull().default(''),
  isDraft: boolean('is_draft').notNull().default(true),
  createdAt: integer('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const postSchema = createSelectSchema(posts);
export type Post = z.infer<typeof postSchema>;

export const insertPostSchema = createInsertSchema(posts, {
  title: schema => schema.title.min(1, 'Title is required.'),
});
export type InsertablePost = z.infer<typeof insertPostSchema>;

export const updatePostSchema = insertPostSchema.pick({ title: true, content: true, isDraft: true }).partial();
export type UpdateablePost = z.infer<typeof updatePostSchema>;

export const postLookupSchema = z.object({
  id: z.coerce.number(),
});
export type PostLookup = z.infer<typeof postLookupSchema>;
