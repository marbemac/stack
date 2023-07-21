import type { TPostId } from '@libs/db-model/ids';
import type { TrpcRouter } from '@libs/internal-api';
import type { CreateTRPCSolid } from '@marbemac/client-trpc-solid';
import type { TemplatedRoutePaths } from '@marbemac/utils-types';
import type { RouteDataFunc, RouteDataFuncArgs, RouteDefinition } from '@solidjs/router';
import { onMount } from 'solid-js';
import { isServer } from 'solid-js/web';

import Debug from '~/routes/debug.tsx';
import Home from '~/routes/home.tsx';
import PostEditor from '~/routes/post-editor.tsx';
import PostHome from '~/routes/post-home.tsx';
import Posts from '~/routes/posts.tsx';
import PostsHome from '~/routes/posts-home.tsx';

export type AppRoutes = TemplatedRoutePaths<ReturnType<typeof createRoutes>>;

export const createRoutes = (trpc: CreateTRPCSolid<TrpcRouter>) => {
  let shouldRunDataFns = isServer;

  onMount(() => {
    shouldRunDataFns = true;
  });

  const dataFn = (fn: RouteDataFunc) => (props: RouteDataFuncArgs) => {
    if (!shouldRunDataFns) return;
    return fn(props);
  };

  const routes = [
    {
      path: '' as const,
      component: Home,
    },
    {
      path: 'debug' as const,
      component: Debug,
    },
    {
      path: 'posts' as const,
      component: Posts,
      data: dataFn(() => trpc.posts.list.ensureQueryData()),
      children: [
        {
          path: '' as const,
          component: PostsHome,
        },
        {
          path: ':id' as const,
          component: PostHome,
          data: dataFn(({ params }) => trpc.posts.byId.ensureQueryData({ postId: params['id'] as TPostId })),
        },
        {
          path: ':id/edit' as const,
          component: PostEditor,
        },
      ],
    },
  ] satisfies RouteDefinition[];

  return routes;
};
