import { useHead } from '@marbemac/ssr-react';
import { Link, Outlet, Route } from '@tanstack/router';
import { Suspense } from 'react';

import { useTrpc } from '~/utils/trpc.ts';

import { rootRoute } from './root.tsx';

export const postsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'posts',
  loader: ({ context }) => {
    void context.trpc.posts.list.ensureQueryData(undefined);
  },
  pendingComponent: () => <div>loading...</div>,
  component: () => {
    console.log('Posts.render');

    useHead({ title: 'Posts page' });

    const posts = useTrpc().posts.list.useQuery();
    if (posts.isLoading) {
      return <div>no data...</div>;
    }

    return (
      <div className="p-2">
        <Waiter wait={2000} />

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

const Waiter = (props: { wait: number }) => {
  return (
    <Suspense fallback={<div>{`waiting ${props.wait}...`}</div>}>
      <WaiterInner {...props} />
    </Suspense>
  );
};

const WaiterInner = ({ wait }: { wait: number }) => {
  const query = useTrpc().posts.nested.wait.useQuery({ wait });

  return <div>result: {query.data}</div>;
};
