import type { RouteDataFunc, RouteDataFuncArgs, RouteDefinition } from '@solidjs/router';
import { import$ } from '@tanstack/bling';
import { type QueryClient } from '@tanstack/solid-query';
import { lazy, onMount } from 'solid-js';
import { isServer } from 'solid-js/web';

import { Link } from '~/components/Link.js';
import { postQueries } from '~/domains/posts/web.js';

export const createRoutes = (queryClient: QueryClient) => {
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
      path: '',
      component: lazy(() =>
        import$({
          default: () => (
            <div>
              Home - <Link href="/posts">Posts</Link> - <Link href="/posts/6">Post 6</Link> -{' '}
              <Link href="/posts/6/edit">Post 6 Edit</Link>
            </div>
          ),
        }),
      ),
    },
    {
      path: 'posts',
      component: lazy(() => import('~/routes/posts.tsx')),
      data: dataFn(() => queryClient.prefetchQuery(postQueries.list())),
      children: [
        {
          path: '',
          component: lazy(() => import('~/routes/posts-home.tsx')),
        },
        {
          path: ':id',
          component: lazy(() => import('~/routes/post-home.tsx')),
          data: dataFn(({ params }) => queryClient.prefetchQuery(postQueries.detail(params.id))),
        },
        {
          path: ':id/edit',
          component: lazy(() => import('~/routes/post-editor.tsx')),
        },
      ],
    },
  ] satisfies RouteDefinition[];

  return routes;
};
