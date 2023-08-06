import type { DbConn } from '@libs/db';
import { eq } from 'drizzle-orm';

import { PostId } from './id.ts';
import type { InsertablePost, PostLookup, UpdateablePost } from './schema.ts';
import { posts } from './schema.ts';

export type PostClient = ReturnType<typeof postClient>;

export const postClient = ({ db }: { db: DbConn }) => {
  const model = {
    create: async (post: InsertablePost) => {
      return (
        await db
          .insert(posts)
          .values({
            ...post,
            id: PostId.generate(),
          })
          .returning()
      )[0];
    },

    read: async ({ id }: PostLookup) => {
      return (await db.select().from(posts).where(eq(posts.id, id)))[0];
    },

    update: async ({ id }: PostLookup, values: UpdateablePost) => {
      return (await db.update(posts).set(values).where(eq(posts.id, id)).returning())[0];
    },

    delete: ({ id }: PostLookup) => {
      return db.delete(posts).where(eq(posts.id, id)).returning({ id: posts.id });
    },

    list: () => {
      return db.select().from(posts);
    },
  };

  return model;
};
