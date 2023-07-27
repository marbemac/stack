import type { FC } from 'react';

import type { PageEvent } from '../universal/index.js';
import { HeadProvider, ServerContext } from '../universal/index.js';

export interface RenderProps<T extends PageEvent = PageEvent> {
  pageEvent: T;
  Root: FC;
}

export function render({ pageEvent, Root }: RenderProps) {
  return (
    <ServerContext.Provider value={pageEvent}>
      <HeadProvider value={pageEvent.head}>
        <Root />
      </HeadProvider>
    </ServerContext.Provider>
  );
}
