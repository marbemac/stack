import type { DbConn } from '@libs/db';
import { eq } from 'drizzle-orm';

import { PostId } from './id.ts';
import type { InsertablePost, PostLookup, UpdateablePost } from './schema.ts';
import { posts } from './schema.ts';

export type PostClient = ReturnType<typeof postClient>;

export const postClient = ({ db }: { db: DbConn }) => {
  const model = {
    create: (post: InsertablePost) => {
      return db
        .insert(posts)
        .values({
          ...post,
          id: PostId.generate(),
        })
        .returning()
        .get();
    },

    read: ({ id }: PostLookup) => {
      return db.select().from(posts).where(eq(posts.id, id)).get();
    },

    update: ({ id }: PostLookup, values: UpdateablePost) => {
      return db.update(posts).set(values).where(eq(posts.id, id)).returning().get();
    },

    delete: ({ id }: PostLookup) => {
      return db.delete(posts).where(eq(posts.id, id)).returning({ id: posts.id }).get();
    },

    list: () => {
      return db.select().from(posts).all();
    },
  };

  return model;
};
