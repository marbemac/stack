import type { CreateTRPCClientOptions } from '@trpc/client';
import { createTRPCUntypedClient } from '@trpc/client';
import type { AnyRouter } from '@trpc/server';
import superjson from 'superjson';

import type { BuildLinksOpts } from './build-links.js';
import { buildLinks } from './build-links.js';

export interface CreateTrpcClientOpts<T extends AnyRouter> extends BuildLinksOpts<T> {
  config?: (defaultConfig: CreateTRPCClientOptions<T>) => CreateTRPCClientOptions<T>;
}

export function createTRPCClient<T extends AnyRouter>({
  trpcCaller,
  httpBatchLinkOpts,
  config,
}: CreateTrpcClientOpts<T>) {
  const links = buildLinks<T>({ trpcCaller, httpBatchLinkOpts });

  // @ts-expect-error trpc typings are not flexible enough
  const defaultConfig: CreateTRPCClientOptions<T> = { transformer: superjson, links };

  const finalConfig = config ? config(defaultConfig) : defaultConfig;

  return createTRPCUntypedClient<AnyRouter>(finalConfig);
}
