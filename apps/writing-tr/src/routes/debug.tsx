import { Route } from '@tanstack/router';
import { Suspense } from 'react';

import { useTrpc } from '~/utils/trpc.ts';

import { rootRoute } from './root.tsx';

export const debugRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'debug',
  component: () => {
    return (
      <div className="p-2">
        <h1>Debug</h1>
        <Suspense fallback={<div>{`outer waiting...`}</div>}>
          <WaiterInner wait={2000} deferStream />

          <Waiter wait={2500} />
          <Waiter wait={4000} />
        </Suspense>
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

const WaiterInner = ({ wait, deferStream }: { wait: number; deferStream?: boolean }) => {
  const query = useTrpc().posts.nested.wait.useQuery({ wait }, { meta: { deferStream } });

  return <div>result: {query.data}</div>;
};
