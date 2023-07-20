import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

import { postsRouter } from './routers/posts.js';
import { router } from './trpc.js';

export const trpcRouter = router({
  posts: postsRouter,
});

export type TrpcRouter = typeof trpcRouter;
export type TrpcRouterInput = inferRouterInputs<TrpcRouter>;
export type TrpcRouterOutput = inferRouterOutputs<TrpcRouter>;
export type TrpcCaller = ReturnType<TrpcRouter['createCaller']>;
