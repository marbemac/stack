import type { QueryKey, QueryObserver, QueryObserverResult } from '@tanstack/query-core';
import type { QueryClient } from './QueryClient';
import type { Accessor } from 'solid-js';
import type { CreateBaseQueryOptions } from './types';
export declare function createBaseQuery<TQueryFnData, TError, TData, TQueryData, TQueryKey extends QueryKey>(options: Accessor<CreateBaseQueryOptions<TQueryFnData, TError, TData, TQueryData, TQueryKey>>, Observer: typeof QueryObserver, queryClient?: Accessor<QueryClient>): QueryObserverResult<TData, TError>;
