import { boolean, id, integer, table, text } from '@libs/db/builder';
import { sql } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

import type { TPostId } from './id.ts';
import { PostId } from './id.ts';

const TABLE_NAME = 'posts';

export const posts = table(TABLE_NAME, {
  // id: text('id').primaryKey(),
  id: id<TPostId>()('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull().default(''),
  isDraft: boolean('is_draft').notNull().default(true),
  createdAt: integer('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const postSchema = createSelectSchema(posts, {
  id: PostId.validator,
});
export type Post = z.infer<typeof postSchema>;

export const insertPostSchema = createInsertSchema(posts, {
  title: schema => schema.title.min(1, 'Title is required.'),
}).omit({ id: true });
export type InsertablePost = z.infer<typeof insertPostSchema>;

export const updatePostSchema = insertPostSchema.pick({ title: true, content: true, isDraft: true }).partial();
export type UpdateablePost = z.infer<typeof updatePostSchema>;

export const postLookupSchema = z.object({
  id: PostId.validator,
});
export type PostLookup = z.infer<typeof postLookupSchema>;
