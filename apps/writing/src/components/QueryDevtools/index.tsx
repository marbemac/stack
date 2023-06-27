import type { Component } from 'solid-js';
import { lazy, Suspense } from 'solid-js';
import { isDev, isServer } from 'solid-js/web';

import { ClientOnly } from '../ClientOnly.tsx';
import type { DevtoolsOptions } from './QueryDevtools';

const BaseQueryDevtools =
  isServer || !isDev
    ? null
    : lazy(() =>
        import('./QueryDevtools.tsx').then(r => ({
          default: r.SolidQueryDevtools,
        })),
      );

export const QueryDevtools: Component<DevtoolsOptions> = props => {
  return isDev ? (
    <ClientOnly>
      {isServer || !BaseQueryDevtools ? null : (
        <Suspense>
          <BaseQueryDevtools {...props} />
        </Suspense>
      )}
    </ClientOnly>
  ) : null;
};
