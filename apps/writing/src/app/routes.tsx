import type { RouteDefinition } from '@solidjs/router';
import { import$ } from '@tanstack/bling';
import type { QueryClient } from '@tanstack/solid-query';
import { lazy } from 'solid-js';

import PostHome from './routes/post-home.js';
import Posts from './routes/posts.js';
import PostsHome from './routes/posts-home.js';

export const createRoutes = (queryClient: QueryClient) => {
  const routes = [
    {
      path: '',
      component: lazy(() => import$({ default: () => <div>Home</div> })),
    },
    {
      path: 'posts',
      component: Posts,
      children: [
        {
          path: '',
          component: PostsHome,
        },
        {
          path: ':id',
          component: PostHome,
        },
      ],
    },
  ] satisfies RouteDefinition[];

  return routes;

  // const routes = [
  //   {
  //     path: '/',
  //     component: App,
  //     children: [
  //       {
  //         path: '',
  //         component: lazy(() => import$({ default: () => <div>Home</div> })),
  //       },
  //       {
  //         path: 'about',
  //         data: () => {
  //           return useLoader(server$(() => ({ count })));
  //         },
  //         component: lazy(() =>
  //           import$({
  //             default: () => {
  //               const routeData = useRouteData();
  //               const [action, submit] = useAction(increment);
  //               return (
  //                 <div>
  //                   About <Show when={routeData()}>{routeData().count}</Show>
  //                   <Suspense fallback={'loading'}>
  //                     <LazyHello3 />
  //                   </Suspense>
  //                   <button onClick={() => submit()}>Increment</button>
  //                 </div>
  //               );
  //             },
  //           }),
  //         ),
  //       },
  //     ],
  //   },
  // ] satisfies RouteDefinition[];
};
