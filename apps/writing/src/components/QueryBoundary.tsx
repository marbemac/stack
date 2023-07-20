import type { TrpcRouter } from '@libs/internal-api';
import type { TRPCClientErrorLike } from '@marbemac/client-trpc-solid';
import type { CreateQueryResult } from '@tanstack/solid-query';
import type { Accessor, JSX } from 'solid-js';
import { ErrorBoundary, Match, Suspense, Switch } from 'solid-js';

export interface QueryBoundaryProps<T = unknown> {
  query: CreateQueryResult<T, TRPCClientErrorLike<TrpcRouter>>;

  /**
   * Triggered when the data is initially loading.
   */
  loadingFallback?: JSX.Element;

  /**
   * Triggered when fetching is complete, but the returned data was falsey.
   */
  notFoundFallback?: JSX.Element;

  /**
   * Triggered when fetching is complete, and the returned data is not falsey.
   */
  children: (data: Accessor<NonNullable<T>>) => JSX.Element;
}

/**
 * Convenience wrapper that handles suspense and errors for queries. Makes the results of query.data available to
 * children (as a render prop) in a type-safe way.
 */
export function QueryBoundary<T>(props: QueryBoundaryProps<T>) {
  return (
    <ErrorBoundary
      fallback={err => {
        // @TODO.. brittle. First condition is in SSR, second is on client
        const notFound = err.cause?.code === 'NOT_FOUND' || err.message === 'Not found';
        if (notFound) {
          return props.notFoundFallback ? props.notFoundFallback : <div>not found</div>;
        }

        if (import.meta.env.DEV) {
          console.error('QueryBoundary error', { props, err });
        }

        return <div>An error occurred while making the query (TODO, improve this) {err}.</div>;
      }}
    >
      <Suspense fallback={props.loadingFallback}>
        <Switch>
          <Match when={props.query.isError}>
            <Error error={props.query.error} refetch={props.query.refetch} />
          </Match>

          <Match when={!props.query.isFetching && !props.query.data}>
            {props.notFoundFallback ? props.notFoundFallback : <div>not found</div>}
          </Match>

          <Match when={props.query.data}>{props.children}</Match>
        </Switch>
      </Suspense>
    </ErrorBoundary>
  );
}

interface ErrorProps {
  error: TRPCClientErrorLike<TrpcRouter> | Error | null;
  refetch: () => void;
}

const Error = (props: ErrorProps) => {
  console.error('Error in QueryBoundary', props.error);

  return (
    <div>
      <div class="text-red-800">{props.error?.message}</div>
      <button
        onClick={() => {
          void props.refetch();
        }}
      >
        Retry
      </button>
    </div>
  );
};
