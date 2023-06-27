import { eq } from 'drizzle-orm';

import type { DbClient } from '~/db/client.js';

import type { InsertablePost, PostLookup, UpdateablePost } from './schema.js';
import { posts } from './schema.js';

export type PostModel = ReturnType<typeof postModel>;

export const postModel = ({ dbClient: db }: { dbClient: DbClient }) => {
  const model = {
    create: (post: InsertablePost) => {
      return db.insert(posts).values(post).returning().get();
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
