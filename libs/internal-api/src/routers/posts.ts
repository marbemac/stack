import { PostId } from '@libs/db-model/ids';
import { insertPostSchema, postLookupSchema, updatePostSchema } from '@libs/db-model/schema';
import { NotFoundError } from '@marbemac/server-trpc';
import { z } from 'zod';

import { publicProcedure, router } from '../trpc.js';

export const postsRouter = router({
  list: publicProcedure.query(async ({ ctx }) => {
    return {
      items: ctx.models.posts.listPosts(),
    };
  }),

  nested: router({
    wait: publicProcedure
      .input(
        z.object({
          wait: z.number(),
        }),
      )
      .query(async ({ input: { wait } }) => {
        await new Promise(resolve => setTimeout(resolve, wait));

        return `waited ${wait}ms`;
      }),

    byId: publicProcedure
      .input(
        z.object({
          postId: PostId.validator,
        }),
      )
      .query(async ({ ctx, input: { postId } }) => {
        const post = await ctx.models.posts.getPost({ id: postId });
        if (!post) throw new NotFoundError();

        return post;
      }),
  }),

  byId: publicProcedure
    .input(
      z.object({
        postId: PostId.validator,
      }),
    )
    .query(async ({ ctx, input: { postId } }) => {
      const post = await ctx.models.posts.getPost({ id: postId });
      if (!post) throw new NotFoundError();

      return post;
    }),

  create: publicProcedure.input(insertPostSchema).mutation(({ ctx, input }) => {
    return ctx.models.posts.insertPost(input);
  }),

  update: publicProcedure
    .input(
      z.object({
        lookup: postLookupSchema,
        values: updatePostSchema,
      }),
    )
    .mutation(({ ctx, input: { lookup, values } }) => {
      return ctx.models.posts.updatePost(lookup, values);
    }),

  delete: publicProcedure
    .input(
      z.object({
        lookup: postLookupSchema,
      }),
    )
    .mutation(({ ctx, input: { lookup } }) => {
      return ctx.models.posts.deletePost(lookup);
    }),
});
