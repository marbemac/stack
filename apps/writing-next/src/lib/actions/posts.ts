'use server';

import { revalidatePath } from 'next/cache';
import { InsertablePost } from '@libs/db-model/schema';
import { notFound } from 'next/navigation';

import { db } from '../db.ts';

export const createPost = async ({ data, path }: { data: InsertablePost; path: string }) => {
  const post = await db.posts.insertPost(data);
  if (!post) notFound();

  revalidatePath(path);

  return post;
};
