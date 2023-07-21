/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createInfiniteQuery as __useInfiniteQuery,
  type CreateInfiniteQueryResult,
  createMutation as __useMutation,
  type CreateMutationResult,
  createQuery as __useQuery,
  type CreateQueryResult,
  type InfiniteData,
  type InvalidateOptions,
  type InvalidateQueryFilters,
  type SetDataOptions,
  type Updater,
} from '@tanstack/solid-query';
import { type TRPCClientErrorLike } from '@trpc/client';
import type {
  AnyRouter,
  inferHandlerInput,
  inferProcedureClientError,
  inferProcedureInput,
  inferProcedureOutput,
  inferSubscriptionOutput,
  ProcedureRecord,
} from '@trpc/server';
import { type inferObservableValue } from '@trpc/server/observable';
import { createEffect, on, onCleanup } from 'solid-js';

import { getArrayQueryKey } from './getArrayQueryKey.ts';
import type {
  CreateTRPCSolidOptions,
  TRPCFetchQueryOptions,
  UseMutationOverride,
  UseTRPCInfiniteQueryOptions,
  UseTRPCMutationOptions,
  UseTRPCQueryOptions,
} from './types.ts';

export interface UseTRPCSubscriptionOptions<TOutput, TError> {
  enabled?: boolean;
  onStarted?: () => void;
  onData: (data: TOutput) => void;
  onError?: (err: TError) => void;
}

function getClientArgs<TPathAndInput extends unknown[], TOptions>(pathAndInput: TPathAndInput, opts: TOptions) {
  const [path, input] = pathAndInput;
  return [path, input, (opts as any)?.trpc] as const;
}

type inferInfiniteQueryNames<TObj extends ProcedureRecord> = {
  [TPath in keyof TObj]: inferProcedureInput<TObj[TPath]> extends {
    cursor?: any;
  }
    ? TPath
    : never;
}[keyof TObj];

type inferProcedures<TObj extends ProcedureRecord> = {
  [TPath in keyof TObj]: {
    input: inferProcedureInput<TObj[TPath]>;
    output: inferProcedureOutput<TObj[TPath]>;
  };
};

interface TRPCHookResult {
  trpc: {
    path: string;
  };
}

/**
 * @internal
 */
export type UseTRPCQueryResult<TData, TError> = CreateQueryResult<TData, TError> & TRPCHookResult;

/**
 * @internal
 */
export type UseTRPCInfiniteQueryResult<TData, TError> = CreateInfiniteQueryResult<TData, TError> & TRPCHookResult;

/**
 * @internal
 */
export type UseTRPCMutationResult<TData, TError, TVariables, TContext> = CreateMutationResult<
  TData,
  TError,
  TVariables,
  TContext
> &
  TRPCHookResult;

/**
 * Create strongly typed react hooks
 * @internal
 */
export function createHooksInternal<TRouter extends AnyRouter>(config: CreateTRPCSolidOptions<TRouter>) {
  const mutationSuccessOverride: UseMutationOverride['onSuccess'] =
    config?.unstable_overrides?.useMutation?.onSuccess ?? (options => options.originalFn());

  const { queryClient } = config;

  type TQueries = TRouter['_def']['queries'];
  type TSubscriptions = TRouter['_def']['subscriptions'];
  type TMutations = TRouter['_def']['mutations'];

  type TError = TRPCClientErrorLike<TRouter>;
  type TInfiniteQueryNames = inferInfiniteQueryNames<TQueries>;

  type TQueryValues = inferProcedures<TQueries>;
  type TMutationValues = inferProcedures<TMutations>;

  function invalidate<TPath extends keyof TQueryValues & string>(
    pathAndInput: [path: TPath, ...args: inferHandlerInput<TQueries[TPath]>],
    filters?: InvalidateQueryFilters,
    options?: InvalidateOptions,
  ): Promise<void> {
    return queryClient.invalidateQueries({
      queryKey: getArrayQueryKey(pathAndInput),
      ...filters,
      ...options,
    });
  }

  function prefetchQuery<TPath extends keyof TQueryValues & string, TOutput extends TQueryValues[TPath]['output']>(
    pathAndInput: [path: TPath, ...args: inferHandlerInput<TQueries[TPath]>],
    opts?: TRPCFetchQueryOptions<TQueryValues[TPath]['input'], TError, TOutput>,
  ): Promise<void> {
    return queryClient.prefetchQuery({
      queryKey: getArrayQueryKey(pathAndInput),
      queryFn: () => (config.client as any).query(...getClientArgs(pathAndInput, opts)),
      ...(opts as any),
    });
  }

  function ensureQueryData<TPath extends keyof TQueryValues & string, TOutput extends TQueryValues[TPath]['output']>(
    pathAndInput: [path: TPath, ...args: inferHandlerInput<TQueries[TPath]>],
    opts?: TRPCFetchQueryOptions<TQueryValues[TPath]['input'], TError, TOutput>,
  ): Promise<void> {
    return queryClient.ensureQueryData({
      queryKey: getArrayQueryKey(pathAndInput),
      queryFn: () => (config.client as any).query(...getClientArgs(pathAndInput, opts)),
      ...(opts as any),
    });
  }

  function setQueryData<TPath extends keyof TQueryValues & string, TOutput extends TQueryValues[TPath]['output']>(
    pathAndInput: [path: TPath, ...args: inferHandlerInput<TQueries[TPath]>],
    updater: Updater<TOutput | undefined, TOutput | undefined>,
    opts?: SetDataOptions,
  ): void {
    queryClient.setQueryData(getArrayQueryKey(pathAndInput), updater, opts);
  }

  function setInfiniteQueryData<
    TPath extends keyof TQueryValues & string,
    TOutput extends TQueryValues[TPath]['output'],
  >(
    pathAndInput: [path: TPath, ...args: inferHandlerInput<TQueries[TPath]>],
    updater: Updater<InfiniteData<TOutput> | undefined, InfiniteData<TOutput> | undefined>,
    opts?: SetDataOptions,
  ): void {
    queryClient.setQueryData(getArrayQueryKey(pathAndInput), updater, opts);
  }

  function useQuery<
    TPath extends keyof TQueryValues & string,
    TQueryFnData = TQueryValues[TPath]['output'],
    TData = TQueryValues[TPath]['output'],
  >(
    pathAndInput: () => [path: TPath, ...args: inferHandlerInput<TQueries[TPath]>],
    opts?: UseTRPCQueryOptions<TPath, TQueryValues[TPath]['input'], TQueryFnData, TData, TError>,
  ): UseTRPCQueryResult<TData, TError> {
    return __useQuery(() => ({
      queryKey: getArrayQueryKey(pathAndInput()),
      queryFn: () => {
        return (config.client as any).query(...getClientArgs(pathAndInput(), opts?.()));
      },
      ...(opts?.() as any),
    })) as UseTRPCQueryResult<TData, TError>;
  }

  function useMutation<TPath extends keyof TMutationValues & string, TContext = unknown>(
    path: TPath | [TPath],
    opts?: UseTRPCMutationOptions<TMutationValues[TPath]['input'], TError, TMutationValues[TPath]['output'], TContext>,
  ): UseTRPCMutationResult<TMutationValues[TPath]['output'], TError, TMutationValues[TPath]['input'], TContext> {
    return __useMutation(() => {
      const actualPath = Array.isArray(path) ? path[0] : path;

      const defaultOpts = queryClient.getMutationDefaults([actualPath.split('.')]);

      return {
        ...opts?.(),
        mutationKey: [actualPath.split('.')],
        mutationFn: input => {
          return (config.client as any).mutation(...getClientArgs([actualPath, input], opts));
        },
        onSuccess(...args) {
          const originalFn = () => opts?.().onSuccess?.(...args) ?? defaultOpts?.onSuccess?.(...args);

          return mutationSuccessOverride({
            originalFn,
            queryClient,
            meta: opts?.()?.meta ?? defaultOpts?.meta ?? {},
          });
        },
      };
    }) as UseTRPCMutationResult<TMutationValues[TPath]['output'], TError, TMutationValues[TPath]['input'], TContext>;
  }

  /**
   * ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️
   *  **Experimental.** API might change without major version bump
   * ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠
   */
  function useSubscription<
    TPath extends keyof TSubscriptions & string,
    TOutput extends inferSubscriptionOutput<TRouter, TPath>,
  >(
    pathAndInput: () => [path: TPath, ...args: inferHandlerInput<TSubscriptions[TPath]>],
    opts: () => UseTRPCSubscriptionOptions<
      inferObservableValue<inferProcedureOutput<TSubscriptions[TPath]>>,
      inferProcedureClientError<TSubscriptions[TPath]>
    >,
  ) {
    return createEffect(
      on(
        () => [pathAndInput(), opts?.()],
        () => {
          if (!(opts().enabled ?? true)) {
            return;
          }
          let isStopped = false;
          const subscription = config.client.subscription(pathAndInput()[0], (pathAndInput()[1] ?? undefined) as any, {
            onStarted: () => {
              if (!isStopped) {
                opts?.()?.onStarted?.();
              }
            },
            onData: data => {
              if (!isStopped) {
                opts?.()?.onData(data as inferObservableValue<inferProcedureOutput<TSubscriptions[TPath]>>);
              }
            },
            onError: err => {
              if (!isStopped) {
                opts?.()?.onError?.(err);
              }
            },
          });
          onCleanup(() => {
            isStopped = true;
            subscription.unsubscribe();
          });
        },
      ),
    );
  }

  function useInfiniteQuery<TPath extends TInfiniteQueryNames & string>(
    pathAndInput: () => [path: TPath, input: Omit<TQueryValues[TPath]['input'], 'cursor'>],
    opts?: UseTRPCInfiniteQueryOptions<
      TPath,
      Omit<TQueryValues[TPath]['input'], 'cursor'>,
      TQueryValues[TPath]['output'],
      TError
    >,
  ): UseTRPCInfiniteQueryResult<TQueryValues[TPath]['output'], TError> {
    return __useInfiniteQuery(() => ({
      queryKey: getArrayQueryKey(pathAndInput()),
      queryFn: queryFunctionContext => {
        const actualInput = {
          ...((pathAndInput()[1] as any) ?? {}),
          cursor: queryFunctionContext.pageParam,
        };

        return (config.client as any).query(...getClientArgs([pathAndInput()[0], actualInput], opts?.()));
      },
      ...(opts?.() as any),
    })) as UseTRPCInfiniteQueryResult<TQueryValues[TPath]['output'], TError>;
  }

  return {
    invalidate,
    prefetchQuery,
    ensureQueryData,
    setData: setQueryData,
    setInfiniteData: setInfiniteQueryData,
    useQuery,
    useMutation,
    useSubscription,
    useInfiniteQuery,
  };
}

export type CreateSolidQueryHooks<TRouter extends AnyRouter> = ReturnType<typeof createHooksInternal<TRouter>>;
