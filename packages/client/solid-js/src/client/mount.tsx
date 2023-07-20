import type { PageEvent } from '@marbemac/server-ssr';
import { MetaProvider } from '@solidjs/meta';
import type { RouterProps } from '@solidjs/router';
import { Router } from '@solidjs/router';
import type { Component, JSX } from 'solid-js';
import { hydrate } from 'solid-js/web';

import { ServerContext } from '../universal/index.js';

function throwClientError(field: string): any {
  throw new Error(
    `"${field}" is not available on the client. Use it within an \`if (isServer)\` block to ensure it only runs on the server`,
  );
}

interface ClientScaffoldProps {
  children: JSX.Element;
  router?: {
    preload?: RouterProps['preload'];
    preloadDelay?: RouterProps['preloadDelay'];
  };
}

const isDev = import.meta.env.MODE === 'development';

const ClientScaffold = (props: ClientScaffoldProps) => {
  const mockFetchEvent: PageEvent = {
    env: {},
    get req() {
      if (isDev) {
        return throwClientError('req');
      }
    },
    get url() {
      if (isDev) {
        return throwClientError('url');
      }
    },
    get responseHeaders() {
      if (isDev) {
        return throwClientError('responseHeaders');
      }
    },
    get tags() {
      if (isDev) {
        return throwClientError('tags');
      }
    },
    get routerContext() {
      if (isDev) {
        return throwClientError('routerContext');
      }
    },
    setStatusCode() {
      if (isDev) {
        return throwClientError('setStatusCode');
      }
    },
    getStatusCode() {
      if (isDev) {
        return throwClientError('getStatusCode');
      }
    },
    extra: {},
  };

  return (
    <ServerContext.Provider value={mockFetchEvent}>
      <MetaProvider>
        <Router {...props.router}>{props.children}</Router>
      </MetaProvider>
    </ServerContext.Provider>
  );
};

type MountProps = {
  Root: Component;
} & Pick<ClientScaffoldProps, 'router'>;

export const mount = ({ Root, router }: MountProps) => {
  hydrate(
    () => (
      <ClientScaffold router={router}>
        <Root />
      </ClientScaffold>
    ),
    document,
  );
};
