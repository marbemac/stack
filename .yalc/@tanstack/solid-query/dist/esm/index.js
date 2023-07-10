import { notifyManager, QueryClient as QueryClient$1, hydrate, QueryObserver, InfiniteQueryObserver, MutationObserver, QueriesObserver } from '@tanstack/query-core';
export * from '@tanstack/query-core';
import { batch, createContext, useContext, onMount, onCleanup, createMemo, createResource, createComputed, on, createSignal } from 'solid-js';
import { createComponent, isServer } from 'solid-js/web';
import { createStore, unwrap, reconcile } from 'solid-js/store';

notifyManager.setBatchNotifyFunction(batch);

class QueryClient extends QueryClient$1 {
  constructor(config = {}) {
    super(config);
  }
}

const QueryClientContext = createContext(undefined);
const useQueryClient = queryClient => {
  if (queryClient) {
    return queryClient;
  }
  const client = useContext(QueryClientContext);
  if (!client) {
    throw new Error('No QueryClient set, use QueryClientProvider to set one');
  }
  return client;
};
const QueryClientProvider = props => {
  onMount(() => {
    props.client.mount();
  });
  onCleanup(() => props.client.unmount());
  return createComponent(QueryClientContext.Provider, {
    get value() {
      return props.client;
    },
    get children() {
      return props.children;
    }
  });
};

function shouldThrowError(throwError, params) {
  // Allow throwError function to override throwing behavior on a per-error basis
  if (typeof throwError === 'function') {
    return throwError(...params);
  }
  return !!throwError;
}

/* eslint-disable @typescript-eslint/no-unnecessary-condition */
// Had to disable the lint rule because isServer type is defined as false
// in solid-js/web package. I'll create a GitHub issue with them to see
// why that happens.

function reconcileFn(store, result, reconcileOption) {
  if (reconcileOption === false) return result;
  if (typeof reconcileOption === 'function') {
    const newData = reconcileOption(store.data, result.data);
    return {
      ...result,
      data: newData
    };
  }
  const newData = reconcile(result.data, {
    key: reconcileOption
  })(store.data);
  return {
    ...result,
    data: newData
  };
}
/**
 * Solid's `onHydrated` functionality will silently "fail" (hydrate with an empty object)
 * if the resource data is not serializable.
 */
const hydrateableObserverResult = (query, result) => {
  // Including the extra properties is only relevant on the server
  if (!isServer) return result;
  return {
    ...unwrap(result),
    // cast to refetch function should be safe, since we only remove it on the server,
    // and refetch is not relevant on the server
    refetch: undefined,
    // hydrate() expects a QueryState object, which is similar but not
    // quite the same as a QueryObserverResult object. Thus, for now, we're
    // copying over the missing properties from state in order to support hydration
    dataUpdateCount: query.state.dataUpdateCount,
    fetchFailureCount: query.state.fetchFailureCount,
    isInvalidated: query.state.isInvalidated,
    // Unsetting these properties on the server since they might not be serializable
    fetchFailureReason: null,
    fetchMeta: null
  };
};

// Base Query Function that is used to create the query.
function createBaseQuery(options, Observer, queryClient) {
  const client = createMemo(() => useQueryClient(queryClient?.()));
  const defaultedOptions = client().defaultQueryOptions(options());
  defaultedOptions._optimisticResults = 'optimistic';
  defaultedOptions.structuralSharing = false;
  if (isServer) {
    defaultedOptions.retry = false;
    defaultedOptions.throwOnError = true;
  }
  const observer = new Observer(client(), defaultedOptions);
  const [state, setState] = createStore(observer.getOptimisticResult(defaultedOptions));
  const createServerSubscriber = (resolve, reject) => {
    return observer.subscribe(result => {
      notifyManager.batchCalls(() => {
        const query = observer.getCurrentQuery();
        const unwrappedResult = hydrateableObserverResult(query, result);
        if (unwrappedResult.isError) {
          reject(unwrappedResult.error);
        } else {
          resolve(unwrappedResult);
        }
      })();
    });
  };
  const createClientSubscriber = () => {
    return observer.subscribe(result => {
      notifyManager.batchCalls(() => {
        // @ts-expect-error - This will error because the reconcile option does not
        // exist on the query-core QueryObserverResult type
        const reconcileOptions = observer.options.reconcile;
        // If the query has data we dont suspend but instead mutate the resource
        // This could happen when placeholderData/initialData is defined
        if (queryResource()?.data && result.data && !queryResource.loading) {
          setState(store => {
            return reconcileFn(store, result, reconcileOptions === undefined ? 'id' : reconcileOptions);
          });
          mutate(state);
        } else {
          setState(store => {
            return reconcileFn(store, result, reconcileOptions === undefined ? 'id' : reconcileOptions);
          });
          refetch();
        }
      })();
    });
  };

  /**
   * Unsubscribe is set lazily, so that we can subscribe after hydration when needed.
   */
  let unsubscribe = null;
  const [queryResource, {
    refetch,
    mutate
  }] = createResource(() => {
    return new Promise((resolve, reject) => {
      if (isServer) {
        unsubscribe = createServerSubscriber(resolve, reject);
      } else {
        if (!unsubscribe) {
          unsubscribe = createClientSubscriber();
        }
      }
      if (!state.isLoading) {
        const query = observer.getCurrentQuery();
        resolve(hydrateableObserverResult(query, state));
      }
    });
  }, {
    initialValue: state,
    // If initialData is provided, we resolve the resource immediately
    ssrLoadFrom: options().initialData ? 'initial' : 'server',
    get deferStream() {
      return options().deferStream;
    },
    /**
     * If this resource was populated on the server (either sync render, or streamed in over time), onHydrated
     * will be called. This is the point at which we can hydrate the query cache state, and setup the query subscriber.
     *
     * Leveraging onHydrated allows us to plug into the async and streaming support that solidjs resources already support.
     *
     * Note that this is only invoked on the client, for queries that were originally run on the server.
     */
    onHydrated(_k, info) {
      if (info.value) {
        hydrate(client(), {
          queries: [{
            queryKey: defaultedOptions.queryKey,
            queryHash: defaultedOptions.queryHash,
            state: info.value
          }]
        });
      }
      if (!unsubscribe) {
        /**
         * Do not refetch query on mount if query was fetched on server,
         * even if `staleTime` is not set.
         */
        const newOptions = {
          ...defaultedOptions
        };
        if (defaultedOptions.staleTime || !defaultedOptions.initialData) {
          newOptions.refetchOnMount = false;
        }
        // Setting the options as an immutable object to prevent
        // wonky behavior with observer subscriptions
        observer.setOptions(newOptions);
        setState(observer.getOptimisticResult(newOptions));
        unsubscribe = createClientSubscriber();
      }
    }
  });
  onCleanup(() => {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
  });
  createComputed(on(() => client().defaultQueryOptions(options()), () => observer.setOptions(client().defaultQueryOptions(options())), {
    // Defer because we don't need to trigger on first render
    // This only cares about changes to options after the observer is created
    defer: true
  }));
  createComputed(on(() => state.status, () => {
    if (state.isError && !state.isFetching && shouldThrowError(observer.options.throwOnError, [state.error, observer.getCurrentQuery()])) {
      throw state.error;
    }
  }));
  const handler = {
    get(target, prop) {
      const val = queryResource()?.[prop];
      return val !== undefined ? val : Reflect.get(target, prop);
    }
  };
  return new Proxy(state, handler);
}

function queryOptions(options) {
  return options;
}
function createQuery(options, queryClient) {
  return createBaseQuery(createMemo(() => options()), QueryObserver, queryClient);
}

function useIsFetching(filters, queryClient) {
  const client = createMemo(() => useQueryClient(queryClient?.()));
  const queryCache = createMemo(() => client().getQueryCache());
  const [fetches, setFetches] = createSignal(client().isFetching(filters?.()));
  const unsubscribe = queryCache().subscribe(() => {
    setFetches(client().isFetching(filters?.()));
  });
  onCleanup(unsubscribe);
  return fetches;
}

function createInfiniteQuery(options, queryClient) {
  return createBaseQuery(createMemo(() => options()),
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  InfiniteQueryObserver, queryClient);
}

// HOOK
function createMutation(options, queryClient) {
  const client = useQueryClient(queryClient?.());
  const observer = new MutationObserver(client, options());
  const mutate = (variables, mutateOptions) => {
    observer.mutate(variables, mutateOptions).catch(noop);
  };
  const [state, setState] = createStore({
    ...observer.getCurrentResult(),
    mutate,
    mutateAsync: observer.getCurrentResult().mutate
  });
  createComputed(() => {
    observer.setOptions(options());
  });
  createComputed(on(() => state.status, () => {
    if (state.isError && shouldThrowError(observer.options.throwOnError, [state.error])) {
      throw state.error;
    }
  }));
  const unsubscribe = observer.subscribe(result => {
    setState({
      ...result,
      mutate,
      mutateAsync: result.mutate
    });
  });
  onCleanup(unsubscribe);
  return state;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
function noop() {}

function useIsMutating(filters, queryClient) {
  const client = createMemo(() => useQueryClient(queryClient?.()));
  const mutationCache = createMemo(() => client().getMutationCache());
  const [mutations, setMutations] = createSignal(client().isMutating(filters?.()));
  const unsubscribe = mutationCache().subscribe(_result => {
    setMutations(client().isMutating(filters?.()));
  });
  onCleanup(unsubscribe);
  return mutations;
}

// This defines the `UseQueryOptions` that are accepted in `QueriesOptions` & `GetOptions`.
// `placeholderData` function does not have a parameter
// Avoid TS depth-limit error in case of large array literal
/**
 * QueriesOptions reducer recursively unwraps function arguments to infer/enforce type param
 */
/**
 * QueriesResults reducer recursively maps type param to results
 */
function createQueries(queriesOptions, queryClient) {
  const client = useQueryClient(queryClient?.());
  const defaultedQueries = queriesOptions().queries.map(options => {
    const defaultedOptions = client.defaultQueryOptions(options);
    defaultedOptions._optimisticResults = 'optimistic';
    return defaultedOptions;
  });
  const observer = new QueriesObserver(client, defaultedQueries, queriesOptions().combine ? {
    combine: queriesOptions().combine
  } : undefined);

  // @ts-expect-error - Types issue with solid-js createStore
  const [state, setState] = createStore(observer.getOptimisticResult(defaultedQueries)[1]());
  const unsubscribe = observer.subscribe(result => {
    notifyManager.batchCalls(() => {
      setState(unwrap(result));
    })();
  });
  onCleanup(unsubscribe);
  createComputed(() => {
    const updatedQueries = queriesOptions().queries.map(options => {
      const defaultedOptions = client.defaultQueryOptions(options);
      defaultedOptions._optimisticResults = 'optimistic';
      return defaultedOptions;
    });
    observer.setQueries(updatedQueries, queriesOptions().combine ? {
      combine: queriesOptions().combine
    } : undefined, {
      listeners: false
    });
  });
  return state;
}

export { QueryClient, QueryClientContext, QueryClientProvider, createInfiniteQuery, createMutation, createQueries, createQuery, queryOptions, useIsFetching, useIsMutating, useQueryClient };
//# sourceMappingURL=index.js.map
