import { notifyManager, QueriesObserver } from '@tanstack/query-core';
import { createComputed, onCleanup } from 'solid-js';
import { createStore, unwrap } from 'solid-js/store';
import { useQueryClient } from './QueryClientProvider';
export function createQueries(queriesOptions, queryClient) {
    const client = useQueryClient(queryClient?.());
    const defaultedQueries = queriesOptions().queries.map((options) => {
        const defaultedOptions = client.defaultQueryOptions(options);
        defaultedOptions._optimisticResults = 'optimistic';
        return defaultedOptions;
    });
    const observer = new QueriesObserver(client, defaultedQueries, queriesOptions().combine
        ? {
            combine: queriesOptions().combine,
        }
        : undefined);
    // @ts-expect-error - Types issue with solid-js createStore
    const [state, setState] = createStore(observer.getOptimisticResult(defaultedQueries)[1]());
    const unsubscribe = observer.subscribe((result) => {
        notifyManager.batchCalls(() => {
            setState(unwrap(result));
        })();
    });
    onCleanup(unsubscribe);
    createComputed(() => {
        const updatedQueries = queriesOptions().queries.map((options) => {
            const defaultedOptions = client.defaultQueryOptions(options);
            defaultedOptions._optimisticResults = 'optimistic';
            return defaultedOptions;
        });
        observer.setQueries(updatedQueries, queriesOptions().combine
            ? {
                combine: queriesOptions().combine,
            }
            : undefined, { listeners: false });
    });
    return state;
}
