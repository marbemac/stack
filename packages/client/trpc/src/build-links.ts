import type { HTTPBatchLinkOptions, TRPCLink } from '@trpc/client';
import { httpBatchLink } from '@trpc/client';
import type { AnyRouter } from '@trpc/server';
import { observable } from '@trpc/server/observable';
import { isServer } from 'solid-js/web';

export interface BuildLinksOpts<T extends AnyRouter> {
  httpBatchLinkOpts: HTTPBatchLinkOptions;
  trpcCaller?: ReturnType<T['createCaller']>;
}

export const buildLinks = <T extends AnyRouter>(opts: BuildLinksOpts<T>) => {
  const links: TRPCLink<T>[] = [];

  if (isServer) {
    const { trpcCaller } = opts;
    if (!trpcCaller) {
      throw new Error('Error building TRPC links. trpcCaller must be passed in on the server');
    }

    /**
     * On the server, call the procedure directly rather than making a remote http request.
     * Adapted from info in https://github.com/trpc/trpc/issues/3335.
     */
    const procedureLink: TRPCLink<T> = () => {
      return ({ op }) => {
        if (op.type === 'query') {
          return observable(observer => {
            // op.path is something like "user.list", "user.byId"
            const [namespace, procedure] = op.path.split('.');
            if (!namespace || !procedure) {
              throw new Error('Invalid op.path');
            }

            // @ts-expect-error we don't need to strongly type this
            const promise: Promise<unknown> = op.path.split('.').reduce(function (o, key) {
              return o[key];
            }, trpcCaller)(op.input);

            promise
              .then(data => {
                observer.next({ result: { data } });
                observer.complete();
              })
              .catch(error => {
                observer.error(error);
              });
          });
        }

        throw new Error('Only query operations are supported on the server');
      };
    };

    links.push(procedureLink);
  } else {
    links.push(httpBatchLink(opts.httpBatchLinkOpts));
  }

  return links;
};
