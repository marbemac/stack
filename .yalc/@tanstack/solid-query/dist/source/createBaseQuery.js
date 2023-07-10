import { hydrate, notifyManager } from '@tanstack/query-core';
import { isServer } from 'solid-js/web';
import { createComputed, createMemo, createResource, on, onCleanup, } from 'solid-js';
import { createStore, reconcile, unwrap } from 'solid-js/store';
import { useQueryClient } from './QueryClientProvider';
import { shouldThrowError } from './utils';
function reconcileFn(store, result, reconcileOption) {
    if (reconcileOption === false)
        return result;
    if (typeof reconcileOption === 'function') {
        const newData = reconcileOption(store.data, result.data);
        return { ...result, data: newData };
    }
    const newData = reconcile(result.data, { key: reconcileOption })(store.data);
    return { ...result, data: newData };
}
/**
 * Solid's `onHydrated` functionality will silently "fail" (hydrate with an empty object)
 * if the resource data is not serializable.
 */
const hydrateableObserverResult = (query, result) => {
    // Including the extra properties is only relevant on the server
    if (!isServer)
        return result;
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
        fetchMeta: null,
    };
};
// Base Query Function that is used to create the query.
export function createBaseQuery(options, Observer, queryClient) {
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
        return observer.subscribe((result) => {
            notifyManager.batchCalls(() => {
                const query = observer.getCurrentQuery();
                const unwrappedResult = hydrateableObserverResult(query, result);
                if (unwrappedResult.isError) {
                    reject(unwrappedResult.error);
                }
                else {
                    resolve(unwrappedResult);
                }
            })();
        });
    };
    const createClientSubscriber = () => {
        return observer.subscribe((result) => {
            notifyManager.batchCalls(() => {
                // @ts-expect-error - This will error because the reconcile option does not
                // exist on the query-core QueryObserverResult type
                const reconcileOptions = observer.options.reconcile;
                // If the query has data we dont suspend but instead mutate the resource
                // This could happen when placeholderData/initialData is defined
                if (queryResource()?.data && result.data && !queryResource.loading) {
                    setState((store) => {
                        return reconcileFn(store, result, reconcileOptions === undefined ? 'id' : reconcileOptions);
                    });
                    mutate(state);
                }
                else {
                    setState((store) => {
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
    const [queryResource, { refetch, mutate }] = createResource(() => {
        return new Promise((resolve, reject) => {
            if (isServer) {
                unsubscribe = createServerSubscriber(resolve, reject);
            }
            else {
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
                    queries: [
                        {
                            queryKey: defaultedOptions.queryKey,
                            queryHash: defaultedOptions.queryHash,
                            state: info.value,
                        },
                    ],
                });
            }
            if (!unsubscribe) {
                /**
                 * Do not refetch query on mount if query was fetched on server,
                 * even if `staleTime` is not set.
                 */
                const newOptions = { ...defaultedOptions };
                if (defaultedOptions.staleTime || !defaultedOptions.initialData) {
                    newOptions.refetchOnMount = false;
                }
                // Setting the options as an immutable object to prevent
                // wonky behavior with observer subscriptions
                observer.setOptions(newOptions);
                setState(observer.getOptimisticResult(newOptions));
                unsubscribe = createClientSubscriber();
            }
        },
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
        defer: true,
    }));
    createComputed(on(() => state.status, () => {
        if (state.isError &&
            !state.isFetching &&
            shouldThrowError(observer.options.throwOnError, [
                state.error,
                observer.getCurrentQuery(),
            ])) {
            throw state.error;
        }
    }));
    const handler = {
        get(target, prop) {
            const val = queryResource()?.[prop];
            return val !== undefined ? val : Reflect.get(target, prop);
        },
    };
    return new Proxy(state, handler);
}
