'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { InsertablePost } from '@libs/db-model/schema';
import { db } from '../db.ts';

export const createPost = async ({ data, path }: { data: InsertablePost; path: string }) => {
  const post = await db.posts.insertPost(data);

  // revalidatePath(path);

  await new Promise(r => setTimeout(r, 1000));

  await revalidateTag(`posts`);

  return post;
};
