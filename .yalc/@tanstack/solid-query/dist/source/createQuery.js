import { QueryObserver } from '@tanstack/query-core';
import { createMemo } from 'solid-js';
import { createBaseQuery } from './createBaseQuery';
export function queryOptions(options) {
    return options;
}
export function createQuery(options, queryClient) {
    return createBaseQuery(createMemo(() => options()), QueryObserver, queryClient);
}
