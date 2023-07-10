import { createContext, useContext, onMount, onCleanup } from 'solid-js';
export const QueryClientContext = createContext(undefined);
export const useQueryClient = (queryClient) => {
    if (queryClient) {
        return queryClient;
    }
    const client = useContext(QueryClientContext);
    if (!client) {
        throw new Error('No QueryClient set, use QueryClientProvider to set one');
    }
    return client;
};
export const QueryClientProvider = (props) => {
    onMount(() => {
        props.client.mount();
    });
    onCleanup(() => props.client.unmount());
    return (<QueryClientContext.Provider value={props.client}>
      {props.children}
    </QueryClientContext.Provider>);
};
