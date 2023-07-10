import type { QueryFilters } from '@tanstack/query-core';
import type { QueryClient } from './QueryClient';
import type { Accessor } from 'solid-js';
export declare function useIsFetching(filters?: Accessor<QueryFilters>, queryClient?: Accessor<QueryClient>): Accessor<number>;
