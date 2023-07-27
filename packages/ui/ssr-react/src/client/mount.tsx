import type { FC, ReactNode } from 'react';
import { hydrateRoot } from 'react-dom/client';

import { createHead } from '../universal/head.js';
import type { PageEvent } from '../universal/index.js';
import { HeadProvider, ServerContext } from '../universal/index.js';

function throwClientError(field: string): any {
  throw new Error(
    `"${field}" is not available on the client. Use it within an \`if (isServer)\` block to ensure it only runs on the server. Note this can also occur when using react-devtools for some reason...`,
  );
}

interface ClientScaffoldProps {
  children: ReactNode;
}

const isDev = import.meta.env.DEV;

const head = createHead();

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
  get head() {
    return head;
  },
  get req() {
    if (isDev) {
      return throwClientError('req');
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
};

const ClientScaffold = (props: ClientScaffoldProps) => {
  return (
    <ServerContext.Provider value={mockFetchEvent}>
      <HeadProvider value={mockFetchEvent.head}>{props.children}</HeadProvider>
    </ServerContext.Provider>
  );
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
