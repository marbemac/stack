import { MetaProvider } from '@solidjs/meta';
import { Router } from '@solidjs/router';
import type { Component } from 'solid-js';
import { ssr } from 'solid-js/web';

import type { PageEvent } from '../universal/index.js';
import { ServerContext } from '../universal/index.js';

export interface RenderProps<T extends PageEvent = PageEvent> {
  pageEvent: T;
  Root: Component;
}

export function render({ pageEvent, Root }: RenderProps) {
  return <ServerScaffold pageEvent={pageEvent} Root={Root} />;
}

const docType = ssr('<!DOCTYPE html>');
function ServerScaffold<T extends PageEvent>({ pageEvent, Root }: RenderProps<T>) {
  const parsed = new URL(pageEvent.url);
  const path = parsed.pathname + parsed.search;

  return (
    <ServerContext.Provider value={pageEvent}>
      <MetaProvider tags={pageEvent.tags}>
        <Router url={path} out={pageEvent.routerContext} data={pageEvent.routerData}>
          {docType as unknown as any}
          <Root />
        </Router>
      </MetaProvider>
    </ServerContext.Provider>
  );
}
