import type { DbClient } from '../client.ts';
import type { InsertablePost, PostLookup, UpdateablePost } from './schema.ts';

export type PostModel = ReturnType<typeof postModel>;

type ScopedModels = {
  posts: Pick<DbClient['posts'], 'create' | 'delete' | 'list' | 'read' | 'update'>;
};

export const postModel = ({ dbClient: { posts } }: { dbClient: ScopedModels }) => {
  const actions = {
    listPosts: () => {
      return posts.list();
    },

    getPost: (lookup: PostLookup) => {
      return posts.read(lookup);
    },

    insertPost: (post: InsertablePost) => {
      return posts.create(post);
    },

    updatePost: (lookup: PostLookup, values: UpdateablePost) => {
      return posts.update(lookup, values);
    },

    deletePost: (lookup: PostLookup) => {
      return posts.delete(lookup);
    },
  };

  return actions;
};
