import type { PageEvent } from '@marbemac/server-ssr';
import type { QueryClient } from '@tanstack/react-query';
import type { FC, ReactNode } from 'react';
import { hydrateRoot } from 'react-dom/client';

import { ServerContext } from '../universal/index.js';

function throwClientError(field: string): any {
  throw new Error(
    `"${field}" is not available on the client. Use it within an \`if (isServer)\` block to ensure it only runs on the server`,
  );
}

interface ClientScaffoldProps {
  children: ReactNode;
}

const isDev = import.meta.env.DEV;

const ClientScaffold = (props: ClientScaffoldProps) => {
  const mockFetchEvent: PageEvent = {
    env: {},
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
    get req() {
      if (isDev) {
        return throwClientError('req');
      }
    },
    // get routerContext() {
    //   if (isDev) {
    //     return throwClientError('routerContext');
    //   }
    // },
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

  return <ServerContext.Provider value={mockFetchEvent}>{props.children}</ServerContext.Provider>;
};

export type RootProps = {
  queryClient: QueryClient;
};

type MountProps = {
  Root: FC;
};

export const mount = ({ Root }: MountProps) => {
  hydrateRoot(
    document,
    <ClientScaffold>
      <Root />
    </ClientScaffold>,
  );
};
