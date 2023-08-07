import type { TPostId } from '@libs/db-model/ids';
import { notFound } from 'next/navigation';
import { cache } from 'react';

import { db } from '../db.ts';

export const getPost = cache(async (id: TPostId) => {
  console.log('getPost', id);
  const post = await db.posts.getPost({ id });
  if (!post) notFound();

  return post;
});

export const listPosts = cache(() => {
  console.log('listPosts');

  return db.posts.listPosts();

  // return unstable_cache(
  //   async () => {
  //     console.log('listPosts.inner');
  //     return db.posts.listPosts();
  //   },
  //   [`posts`],
  //   {
  //     revalidate: 10,
  //     tags: [`posts`],
  //   },
  // )();
});
