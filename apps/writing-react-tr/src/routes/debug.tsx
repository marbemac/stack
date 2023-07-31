import { useHead } from '@marbemac/ssr-react';
import { Box } from '@marbemac/ui-primitives-react';
import type { TwProp } from '@marbemac/ui-styles';
import { Route } from '@tanstack/router';
import { Suspense } from 'react';

import { useTrpc } from '~/utils/trpc.ts';

import { rootRoute } from './root.tsx';

export const debugRoute = new Route({
  getParentRoute: () => rootRoute,
  path: 'debug',
  component: function DebugRoute() {
    useHead({ title: 'Debug page' });

    return (
      <div className="p-2">
        <h1>Debug</h1>
        <Suspense fallback={<div>{`outer waiting...`}</div>}>
          <WaiterInner wait={2000} deferStream tw="text-2xl" />

          <Waiter wait={2500} tw="text-xl" />
          <Waiter wait={4000} tw="text-sm" />
        </Suspense>
      </div>
    );
  },
});

const Waiter = (props: { wait: number; tw?: TwProp }) => {
  return (
    <Suspense fallback={<div>{`waiting ${props.wait}...`}</div>}>
      <WaiterInner {...props} />
    </Suspense>
  );
};

const WaiterInner = ({ wait, deferStream, tw }: { wait: number; deferStream?: boolean; tw?: TwProp }) => {
  const query = useTrpc().posts.nested.wait.useQuery({ wait }, { meta: { deferStream } });

  return <Box tw={tw}>result: {query.data}</Box>;
};
