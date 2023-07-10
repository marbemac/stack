import type { QueryKey, DefaultError } from '@tanstack/query-core';
import type { QueryClient } from './QueryClient';
import type { CreateQueryResult, DefinedCreateQueryResult, FunctionedParams, SolidQueryOptions } from './types';
type UndefinedInitialDataOptions<TQueryFnData = unknown, TError = DefaultError, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey> = FunctionedParams<SolidQueryOptions<TQueryFnData, TError, TData, TQueryKey> & {
    initialData?: undefined;
}>;
type DefinedInitialDataOptions<TQueryFnData = unknown, TError = DefaultError, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey> = FunctionedParams<SolidQueryOptions<TQueryFnData, TError, TData, TQueryKey> & {
    initialData: TQueryFnData | (() => TQueryFnData);
}>;
export declare function queryOptions<TQueryFnData = unknown, TError = unknown, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey>(options: UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>): UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>;
export declare function queryOptions<TQueryFnData = unknown, TError = unknown, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey>(options: DefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>): DefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>;
export declare function createQuery<TQueryFnData = unknown, TError = DefaultError, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey>(options: UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>, queryClient?: () => QueryClient): CreateQueryResult<TData, TError>;
export declare function createQuery<TQueryFnData = unknown, TError = DefaultError, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey>(options: DefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey>, queryClient?: () => QueryClient): DefinedCreateQueryResult<TData, TError>;
export {};
