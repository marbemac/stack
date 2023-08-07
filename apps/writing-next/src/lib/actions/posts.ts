'use server';

import type { InsertablePost } from '@libs/db-model/schema';
import { revalidatePath } from 'next/cache';
import { notFound } from 'next/navigation';

import { db } from '../db.ts';

export const createPost = async ({ data, path }: { data: InsertablePost; path: string }) => {
  const post = await db.posts.insertPost(data);
  if (!post) notFound();

  revalidatePath(path);

  return post;
};
