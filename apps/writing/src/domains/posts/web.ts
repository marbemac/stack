import { createQueryKeys } from '@lukemorales/query-key-factory';
import { server$ } from '@tanstack/bling/server';

import { reqCtxAls } from '~/utils/req-context.js';

import { KEY_PLURAL } from './consts.js';
import type { PostLookup } from './schema.js';

const list = server$(() => {
  const {
    controllers: { posts },
  } = reqCtxAls.getStore()!;

  return { items: posts.listPosts() };
});

const detail = server$((lookup: PostLookup) => {
  const {
    controllers: { posts },
  } = reqCtxAls.getStore()!;

  return posts.getPost(lookup);
});

export const postQueries = createQueryKeys(KEY_PLURAL, {
  list: () => ({
    queryKey: ['all'],
    queryFn: () => {
      return list();
    },
  }),

  detail: (postId: number) => ({
    queryKey: [postId],
    queryFn: () => {
      return detail({ id: postId });
    },
  }),
});
