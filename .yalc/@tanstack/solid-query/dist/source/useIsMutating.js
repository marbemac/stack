import { useQueryClient } from './QueryClientProvider';
import { createSignal, onCleanup, createMemo } from 'solid-js';
export function useIsMutating(filters, queryClient) {
    const client = createMemo(() => useQueryClient(queryClient?.()));
    const mutationCache = createMemo(() => client().getMutationCache());
    const [mutations, setMutations] = createSignal(client().isMutating(filters?.()));
    const unsubscribe = mutationCache().subscribe((_result) => {
        setMutations(client().isMutating(filters?.()));
    });
    onCleanup(unsubscribe);
    return mutations;
}
