import { InfiniteQueryObserver } from '@tanstack/query-core';
import { createBaseQuery } from './createBaseQuery';
import { createMemo } from 'solid-js';
export function createInfiniteQuery(options, queryClient) {
    return createBaseQuery(createMemo(() => options()), 
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    InfiniteQueryObserver, queryClient);
}
