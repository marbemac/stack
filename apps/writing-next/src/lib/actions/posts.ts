'use server';

import { revalidatePath } from 'next/cache';
import { InsertablePost } from '@libs/db-model/schema';
import { db } from '../db.ts';
import { notFound } from 'next/navigation';

export const createPost = async ({ data, path }: { data: InsertablePost; path: string }) => {
  const post = await db.posts.insertPost(data);
  if (!post) notFound();

  revalidatePath(path);

  return post;
};
