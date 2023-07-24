import { Link, Outlet, Route } from '@tanstack/router';

import { useTrpc } from '~/utils/trpc.ts';

import { rootRoute } from './root.tsx';

export const postsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'posts',
  loader: ({ context }) => {
    return context.trpc.posts.list.ensureQueryData();
  },
  component: () => {
    const posts = useTrpc().posts.list.useQuery();
    if (posts.isLoading) {
      return <div>no data...</div>;
    }

    return (
      <div className="p-2">
        <ul>
          {posts.data?.items.map(i => (
            <li key={i.id}>
              <Link to="/posts/$postId" params={{ postId: i.id }} activeProps={{ className: 'font-bold' }}>
                {i.id} - {i.title}
              </Link>
            </li>
          ))}
        </ul>

        <hr />

        <Outlet />
      </div>
    );
  },
});
