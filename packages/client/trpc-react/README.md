# @marbemac/client-trpc-react

## Setup

**1. Create a typed provider and re-export the functions**

```tsx
import type { TrpcRouter } from '@libs/internal-api';
import { createTRPCProvider } from '@marbemac/client-trpc-react';

const { useTrpc, TrpcContext } = createTRPCProvider<TrpcRouter>();

export { TrpcContext, useTrpc };
```

**2. Root provider setup**

```tsx
import { QueryClientProvider } from '@tanstack/react-query';

// wherever you put the file from step #1
import { TrpcContext } from '~/utils/trpc.ts';

export function App() {
  // create a new tanstack query client
  const queryClient = createQueryClient();

  // create an untyped trpc client
  const trpcClient = createTRPCClient({
    // ...your options
  });

  // create the react trpc client
  const trpc = createTRPCReact<TrpcRouter>({
    client: trpcClient,
    queryClient,
    unstable_overrides: {
      useMutation: {
        async onSuccess(opts) {
          // Calls the `onSuccess` defined in the `useQuery()`-options:
          await opts.originalFn();

          // Simplest cache strategy.. always invalidate active queries after any mutation
          return queryClient.invalidateQueries({
            // mark all queries as stale
            type: 'all',
            // only immediately refetch active queries
            refetchType: 'active',
          });
        },
      },
    },
  });

  return (
    <html>
      <body>
        <QueryClientProvider client={queryClient}>
          <TrpcContext.Provider value={{ trpc }}>{/* ... your app */}</TrpcContext.Provider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
```

## Usage

```tsx
// wherever you put the file from step #1
import { useTrpc } from '~/utils/trpc.ts';

const Post = (props: { id: number }) => {
  const query = useTrpc().posts.byId.useQuery(() => ({ id: props.id }));

  return (
    <Suspense fallback={<div>{`loading`}</div>}>
      <div>result {query.data.id}</div>
    </Suspense>
  );
};
```
