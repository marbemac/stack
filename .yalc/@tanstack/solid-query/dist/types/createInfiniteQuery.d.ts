import type { QueryKey, DefaultError, InfiniteData } from '@tanstack/query-core';
import type { QueryClient } from './QueryClient';
import type { CreateInfiniteQueryOptions, CreateInfiniteQueryResult } from './types';
import type { Accessor } from 'solid-js';
export declare function createInfiniteQuery<TQueryFnData, TError = DefaultError, TData = InfiniteData<TQueryFnData>, TQueryKey extends QueryKey = QueryKey, TPageParam = unknown>(options: CreateInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam>, queryClient?: Accessor<QueryClient>): CreateInfiniteQueryResult<TData, TError>;
