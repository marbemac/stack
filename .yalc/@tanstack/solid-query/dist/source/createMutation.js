import { MutationObserver } from '@tanstack/query-core';
import { useQueryClient } from './QueryClientProvider';
import { createComputed, onCleanup, on } from 'solid-js';
import { createStore } from 'solid-js/store';
import { shouldThrowError } from './utils';
// HOOK
export function createMutation(options, queryClient) {
    const client = useQueryClient(queryClient?.());
    const observer = new MutationObserver(client, options());
    const mutate = (variables, mutateOptions) => {
        observer.mutate(variables, mutateOptions).catch(noop);
    };
    const [state, setState] = createStore({
        ...observer.getCurrentResult(),
        mutate,
        mutateAsync: observer.getCurrentResult().mutate,
    });
    createComputed(() => {
        observer.setOptions(options());
    });
    createComputed(on(() => state.status, () => {
        if (state.isError &&
            shouldThrowError(observer.options.throwOnError, [state.error])) {
            throw state.error;
        }
    }));
    const unsubscribe = observer.subscribe((result) => {
        setState({
            ...result,
            mutate,
            mutateAsync: result.mutate,
        });
    });
    onCleanup(unsubscribe);
    return state;
}
// eslint-disable-next-line @typescript-eslint/no-empty-function
function noop() { }
