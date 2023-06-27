import type { Models } from '../models.js';
import type { KEY_PLURAL } from './consts.js';
import type { InsertablePost, PostLookup, UpdateablePost } from './schema.js';

export type PostController = ReturnType<typeof postController>;

type ScopedModels = {
  [KEY_PLURAL]: Pick<Models[typeof KEY_PLURAL], 'create' | 'delete' | 'list' | 'read' | 'update'>;
};

export const postController = ({ models: m }: { models: ScopedModels }) => {
  const actions = {
    listPosts: () => {
      return m.posts.list();
    },

    getPost: (lookup: PostLookup) => {
      return m.posts.read(lookup);
    },

    insertPost: (post: InsertablePost) => {
      return m.posts.create(post);
    },

    updatePost: (lookup: PostLookup, values: UpdateablePost) => {
      return m.posts.update(lookup, values);
    },

    deletePost: (lookup: PostLookup) => {
      return m.posts.delete(lookup);
    },
  };

  return actions;
};
