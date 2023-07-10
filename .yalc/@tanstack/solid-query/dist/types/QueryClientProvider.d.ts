import type { QueryClient } from './QueryClient';
import type { JSX } from 'solid-js';
export declare const QueryClientContext: import("solid-js").Context<QueryClient>;
export declare const useQueryClient: (queryClient?: QueryClient) => QueryClient;
export type QueryClientProviderProps = {
    client: QueryClient;
    children?: JSX.Element;
};
export declare const QueryClientProvider: (props: QueryClientProviderProps) => JSX.Element;
