import { QueryClient as QueryCoreClient } from '@tanstack/query-core';
export class QueryClient extends QueryCoreClient {
    constructor(config = {}) {
        super(config);
    }
}
