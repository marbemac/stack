import { createQueryKeys } from '@lukemorales/query-key-factory';
import { server$ } from '@tanstack/bling/server';

import { useControllers$ } from '~/utils/req-context.js';
import { sleep } from '~/utils/sleep.js';

import { KEY_PLURAL } from './consts.js';
import type { PostLookup } from './schema.js';

const list = server$(async () => {
  const { posts } = useControllers$();

  await sleep(250);

  return { items: posts.listPosts() };
});

const detail = server$(async (lookup: PostLookup) => {
  const { posts } = useControllers$();

  await sleep(250);

  return posts.getPost(lookup);
});

export const postQueries = createQueryKeys(KEY_PLURAL, {
  list: () => ({
    queryKey: ['all'],
    queryFn: () => list(),
  }),

  detail: (postId: number) => ({
    queryKey: [postId],
    queryFn: () => detail({ id: postId }),
  }),
});
