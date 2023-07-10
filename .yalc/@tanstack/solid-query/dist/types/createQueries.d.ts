import type { QueriesPlaceholderDataFunction, QueryFunction, QueryKey, DefaultError } from '@tanstack/query-core';
import type { QueryClient } from './QueryClient';
import type { Accessor } from 'solid-js';
import type { CreateQueryResult, SolidQueryOptions } from './types';
type CreateQueryOptionsForCreateQueries<TQueryFnData = unknown, TError = DefaultError, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey> = Omit<SolidQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'placeholderData'> & {
    placeholderData?: TQueryFnData | QueriesPlaceholderDataFunction<TQueryFnData>;
};
type MAXIMUM_DEPTH = 20;
type GetOptions<T> = T extends {
    queryFnData: infer TQueryFnData;
    error?: infer TError;
    data: infer TData;
} ? CreateQueryOptionsForCreateQueries<TQueryFnData, TError, TData> : T extends {
    queryFnData: infer TQueryFnData;
    error?: infer TError;
} ? CreateQueryOptionsForCreateQueries<TQueryFnData, TError> : T extends {
    data: infer TData;
    error?: infer TError;
} ? CreateQueryOptionsForCreateQueries<unknown, TError, TData> : T extends [infer TQueryFnData, infer TError, infer TData] ? CreateQueryOptionsForCreateQueries<TQueryFnData, TError, TData> : T extends [infer TQueryFnData, infer TError] ? CreateQueryOptionsForCreateQueries<TQueryFnData, TError> : T extends [infer TQueryFnData] ? CreateQueryOptionsForCreateQueries<TQueryFnData> : T extends {
    queryFn?: QueryFunction<infer TQueryFnData, infer TQueryKey>;
    select: (data: any) => infer TData;
} ? CreateQueryOptionsForCreateQueries<TQueryFnData, Error, TData, TQueryKey> : T extends {
    queryFn?: QueryFunction<infer TQueryFnData, infer TQueryKey>;
} ? CreateQueryOptionsForCreateQueries<TQueryFnData, Error, TQueryFnData, TQueryKey> : CreateQueryOptionsForCreateQueries;
type GetResults<T> = T extends {
    queryFnData: any;
    error?: infer TError;
    data: infer TData;
} ? CreateQueryResult<TData, TError> : T extends {
    queryFnData: infer TQueryFnData;
    error?: infer TError;
} ? CreateQueryResult<TQueryFnData, TError> : T extends {
    data: infer TData;
    error?: infer TError;
} ? CreateQueryResult<TData, TError> : T extends [any, infer TError, infer TData] ? CreateQueryResult<TData, TError> : T extends [infer TQueryFnData, infer TError] ? CreateQueryResult<TQueryFnData, TError> : T extends [infer TQueryFnData] ? CreateQueryResult<TQueryFnData> : T extends {
    queryFn?: QueryFunction<unknown, any>;
    select: (data: any) => infer TData;
} ? CreateQueryResult<TData> : T extends {
    queryFn?: QueryFunction<infer TQueryFnData, any>;
} ? CreateQueryResult<TQueryFnData> : CreateQueryResult;
/**
 * QueriesOptions reducer recursively unwraps function arguments to infer/enforce type param
 */
export type QueriesOptions<T extends any[], Result extends any[] = [], Depth extends ReadonlyArray<number> = []> = Depth['length'] extends MAXIMUM_DEPTH ? CreateQueryOptionsForCreateQueries[] : T extends [] ? [] : T extends [infer Head] ? [...Result, GetOptions<Head>] : T extends [infer Head, ...infer Tail] ? QueriesOptions<[...Tail], [...Result, GetOptions<Head>], [...Depth, 1]> : unknown[] extends T ? T : T extends CreateQueryOptionsForCreateQueries<infer TQueryFnData, infer TError, infer TData, infer TQueryKey>[] ? CreateQueryOptionsForCreateQueries<TQueryFnData, TError, TData, TQueryKey>[] : CreateQueryOptionsForCreateQueries[];
/**
 * QueriesResults reducer recursively maps type param to results
 */
export type QueriesResults<T extends any[], Result extends any[] = [], Depth extends ReadonlyArray<number> = []> = Depth['length'] extends MAXIMUM_DEPTH ? CreateQueryResult[] : T extends [] ? [] : T extends [infer Head] ? [...Result, GetResults<Head>] : T extends [infer Head, ...infer Tail] ? QueriesResults<[...Tail], [...Result, GetResults<Head>], [...Depth, 1]> : T extends CreateQueryOptionsForCreateQueries<infer TQueryFnData, infer TError, infer TData, any>[] ? CreateQueryResult<unknown extends TData ? TQueryFnData : TData, unknown extends TError ? DefaultError : TError>[] : CreateQueryResult[];
export declare function createQueries<T extends any[], TCombinedResult = QueriesResults<T>>(queriesOptions: Accessor<{
    queries: readonly [...QueriesOptions<T>];
    combine?: (result: QueriesResults<T>) => TCombinedResult;
}>, queryClient?: Accessor<QueryClient>): TCombinedResult;
export {};
