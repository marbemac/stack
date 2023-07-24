import type { UseQueryResult } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { Suspense, useCallback } from 'react';
import type { FallbackProps } from 'react-error-boundary';
import { ErrorBoundary } from 'react-error-boundary';

export interface QueryBoundaryProps<T = unknown> {
  query: UseQueryResult<T, Error>;

  /**
   * Triggered when the data is initially loading.
   */
  loadingFallback?: ReactNode;

  /**
   * Triggered when fetching is complete, but the returned data was falsey.
   */
  notFoundFallback?: ReactNode;

  /**
   * Triggered when fetching is complete, and the returned data is not falsey.
   */
  children: (data: NonNullable<T>) => ReactNode;
}

/**
 * Convenience wrapper that handles suspense and errors for queries. Makes the results of query.data available to
 * children (as a render prop) in a type-safe way.
 */
export function QueryBoundary<T>({ notFoundFallback, loadingFallback, query, children }: QueryBoundaryProps<T>) {
  const fallbackRender = useCallback(
    ({ error }: FallbackProps) => {
      // @TODO.. brittle. First condition is in SSR, second is on client
      const notFound = error.cause?.code === 'NOT_FOUND' || error.message === 'Not found';
      if (notFound) {
        return notFoundFallback ? notFoundFallback : <div>not found</div>;
      }

      if (import.meta.env.DEV) {
        console.error('QueryBoundary error', { error, query });
      }

      return <div>An error occurred while making the query (TODO, improve this).</div>;
    },
    [notFoundFallback],
  );

  let elem;
  if (query.isError) {
    elem = <Error error={query.error} refetch={query.refetch} />;
  } else if (query.isFetching && query.data) {
    elem = notFoundFallback ? notFoundFallback : <div>not found</div>;
  }

  return (
    <ErrorBoundary fallbackRender={fallbackRender}>
      <Suspense fallback={loadingFallback}>
        {elem ? elem : query.data ? children(query.data) : loadingFallback}
      </Suspense>
    </ErrorBoundary>
  );
}

interface ErrorProps {
  error: Error | null;
  refetch: () => void;
}

const Error = (props: ErrorProps) => {
  console.error('Error in QueryBoundary', props.error);

  return (
    <div>
      <div className="text-red-800">{props.error?.message}</div>
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
