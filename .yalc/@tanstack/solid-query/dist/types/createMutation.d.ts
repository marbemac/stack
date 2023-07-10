import type { DefaultError } from '@tanstack/query-core';
import type { QueryClient } from './QueryClient';
import type { CreateMutationOptions, CreateMutationResult } from './types';
import type { Accessor } from 'solid-js';
export declare function createMutation<TData = unknown, TError = DefaultError, TVariables = void, TContext = unknown>(options: CreateMutationOptions<TData, TError, TVariables, TContext>, queryClient?: Accessor<QueryClient>): CreateMutationResult<TData, TError, TVariables, TContext>;
