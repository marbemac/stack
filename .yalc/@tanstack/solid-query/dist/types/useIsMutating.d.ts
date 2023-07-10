import type { MutationFilters } from '@tanstack/query-core';
import type { QueryClient } from './QueryClient';
import type { Accessor } from 'solid-js';
export declare function useIsMutating(filters?: Accessor<MutationFilters>, queryClient?: Accessor<QueryClient>): Accessor<number>;
