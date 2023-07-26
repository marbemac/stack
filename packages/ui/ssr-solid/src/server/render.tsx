import type { PageEvent } from '@marbemac/server-ssr';
import { MetaProvider } from '@solidjs/meta';
import { Router } from '@solidjs/router';
import type { Component, ComponentProps } from 'solid-js';
import { ssr } from 'solid-js/web';

import { ServerContext } from '../universal/index.js';

export interface RenderProps<T extends PageEvent = PageEvent> {
  event: T;
  Root: Component;
}

export function render({ event, Root }: RenderProps) {
  return <ServerScaffold event={event} Root={Root} />;
}

const docType = ssr('<!DOCTYPE html>');
function ServerScaffold<T extends PageEvent>({ event, Root }: RenderProps<T>) {
  const parsed = new URL(event.url);
  const path = parsed.pathname + parsed.search;

  return (
    <ServerContext.Provider value={event}>
      <MetaProvider tags={event.tags as ComponentProps<typeof MetaProvider>['tags']}>
        <Router url={path} out={event.routerContext as any} data={event.routerData as any}>
          {docType as unknown as any}
          <Root />
        </Router>
      </MetaProvider>
    </ServerContext.Provider>
  );
}
