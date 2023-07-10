'use strict';

var queryCore = require('@tanstack/query-core');
var solidJs = require('solid-js');
var web = require('solid-js/web');
var store = require('solid-js/store');

queryCore.notifyManager.setBatchNotifyFunction(solidJs.batch);

class QueryClient extends queryCore.QueryClient {
  constructor(config = {}) {
    super(config);
  }
}

const QueryClientContext = solidJs.createContext(undefined);
const useQueryClient = queryClient => {
  if (queryClient) {
    return queryClient;
  }
  const client = solidJs.useContext(QueryClientContext);
  if (!client) {
    throw new Error('No QueryClient set, use QueryClientProvider to set one');
  }
  return client;
};
const QueryClientProvider = props => {
  solidJs.onMount(() => {
    props.client.mount();
  });
  solidJs.onCleanup(() => props.client.unmount());
  return web.createComponent(QueryClientContext.Provider, {
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

function reconcileFn(store$1, result, reconcileOption) {
  if (reconcileOption === false) return result;
  if (typeof reconcileOption === 'function') {
    const newData = reconcileOption(store$1.data, result.data);
    return {
      ...result,
      data: newData
    };
  }
  const newData = store.reconcile(result.data, {
    key: reconcileOption
  })(store$1.data);
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
  if (!web.isServer) return result;
  return {
    ...store.unwrap(result),
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
  const client = solidJs.createMemo(() => useQueryClient(queryClient?.()));
  const defaultedOptions = client().defaultQueryOptions(options());
  defaultedOptions._optimisticResults = 'optimistic';
  defaultedOptions.structuralSharing = false;
  if (web.isServer) {
    defaultedOptions.retry = false;
    defaultedOptions.throwOnError = true;
  }
  const observer = new Observer(client(), defaultedOptions);
  const [state, setState] = store.createStore(observer.getOptimisticResult(defaultedOptions));
  const createServerSubscriber = (resolve, reject) => {
    return observer.subscribe(result => {
      queryCore.notifyManager.batchCalls(() => {
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
      queryCore.notifyManager.batchCalls(() => {
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
  }] = solidJs.createResource(() => {
    return new Promise((resolve, reject) => {
      if (web.isServer) {
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
        queryCore.hydrate(client(), {
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
  solidJs.onCleanup(() => {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
  });
  solidJs.createComputed(solidJs.on(() => client().defaultQueryOptions(options()), () => observer.setOptions(client().defaultQueryOptions(options())), {
    // Defer because we don't need to trigger on first render
    // This only cares about changes to options after the observer is created
    defer: true
  }));
  solidJs.createComputed(solidJs.on(() => state.status, () => {
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
  return createBaseQuery(solidJs.createMemo(() => options()), queryCore.QueryObserver, queryClient);
}

function useIsFetching(filters, queryClient) {
  const client = solidJs.createMemo(() => useQueryClient(queryClient?.()));
  const queryCache = solidJs.createMemo(() => client().getQueryCache());
  const [fetches, setFetches] = solidJs.createSignal(client().isFetching(filters?.()));
  const unsubscribe = queryCache().subscribe(() => {
    setFetches(client().isFetching(filters?.()));
  });
  solidJs.onCleanup(unsubscribe);
  return fetches;
}

function createInfiniteQuery(options, queryClient) {
  return createBaseQuery(solidJs.createMemo(() => options()),
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  queryCore.InfiniteQueryObserver, queryClient);
}

// HOOK
function createMutation(options, queryClient) {
  const client = useQueryClient(queryClient?.());
  const observer = new queryCore.MutationObserver(client, options());
  const mutate = (variables, mutateOptions) => {
    observer.mutate(variables, mutateOptions).catch(noop);
  };
  const [state, setState] = store.createStore({
    ...observer.getCurrentResult(),
    mutate,
    mutateAsync: observer.getCurrentResult().mutate
  });
  solidJs.createComputed(() => {
    observer.setOptions(options());
  });
  solidJs.createComputed(solidJs.on(() => state.status, () => {
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
  solidJs.onCleanup(unsubscribe);
  return state;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
function noop() {}

function useIsMutating(filters, queryClient) {
  const client = solidJs.createMemo(() => useQueryClient(queryClient?.()));
  const mutationCache = solidJs.createMemo(() => client().getMutationCache());
  const [mutations, setMutations] = solidJs.createSignal(client().isMutating(filters?.()));
  const unsubscribe = mutationCache().subscribe(_result => {
    setMutations(client().isMutating(filters?.()));
  });
  solidJs.onCleanup(unsubscribe);
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
  const observer = new queryCore.QueriesObserver(client, defaultedQueries, queriesOptions().combine ? {
    combine: queriesOptions().combine
  } : undefined);

  // @ts-expect-error - Types issue with solid-js createStore
  const [state, setState] = store.createStore(observer.getOptimisticResult(defaultedQueries)[1]());
  const unsubscribe = observer.subscribe(result => {
    queryCore.notifyManager.batchCalls(() => {
      setState(store.unwrap(result));
    })();
  });
  solidJs.onCleanup(unsubscribe);
  solidJs.createComputed(() => {
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

exports.QueryClient = QueryClient;
exports.QueryClientContext = QueryClientContext;
exports.QueryClientProvider = QueryClientProvider;
exports.createInfiniteQuery = createInfiniteQuery;
exports.createMutation = createMutation;
exports.createQueries = createQueries;
exports.createQuery = createQuery;
exports.queryOptions = queryOptions;
exports.useIsFetching = useIsFetching;
exports.useIsMutating = useIsMutating;
exports.useQueryClient = useQueryClient;
Object.keys(queryCore).forEach(function (k) {
  if (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
    enumerable: true,
    get: function () { return queryCore[k]; }
  });
});
//# sourceMappingURL=index.cjs.map
