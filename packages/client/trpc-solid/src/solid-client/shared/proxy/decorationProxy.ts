/* eslint-disable @typescript-eslint/no-explicit-any */
import { type AnyRouter } from '@trpc/server';
import { createRecursiveProxy } from '@trpc/server/shared';
import { getQueryKey } from '../../internals/getQueryKey';
import { type CreateSolidQueryHooks } from '../hooks/createHooksInternal';

const HOOKS_WITH_PLAIN_INPUT = ['invalidate', 'ensureQueryData', 'prefetchQuery'];

/**
 * Create proxy for decorating procedures
 * @internal
 */
export function createSolidProxyDecoration<TRouter extends AnyRouter>(
  name: string,
  hooks: CreateSolidQueryHooks<TRouter>,
) {
  return createRecursiveProxy(opts => {
    const args = opts.args;

    const pathCopy = [name, ...opts.path];

    // The last arg is for instance `.useMutation` or `.useQuery()`
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const lastArg = pathCopy.pop()!;

    // The `path` ends up being something like `post.byId`
    const path = pathCopy.join('.');

    if (lastArg === 'useMutation') {
      return (hooks as any)[lastArg](path, ...args);
    }

    const [input, ...otherArgs] = args;

    if (HOOKS_WITH_PLAIN_INPUT.includes(lastArg)) {
      return (hooks as any)[lastArg](getQueryKey(path, typeof input === 'function' ? input() : input), ...otherArgs);
    }

    return (hooks as any)[lastArg](
      () => getQueryKey(path, typeof input === 'function' ? input() : input),
      ...otherArgs,
    );
  });
}
