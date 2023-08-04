import { TPostId } from '@libs/db-model/ids';
import { cache } from 'react';
import { db } from '../db.ts';
import { unstable_cache } from 'next/cache';

export const getPost = cache((id: TPostId) => {
  console.log('getPost', id);
  return db.posts.getPost({ id });
});

export const listPosts = () => {
  console.log('listPosts');
  // return db.posts.listPosts();

  return unstable_cache(
    async () => {
      console.log('listPosts.inner');
      return db.posts.listPosts();
    },
    [`posts`],
    {
      revalidate: 10,
      tags: [`posts`],
    },
  )();
};
