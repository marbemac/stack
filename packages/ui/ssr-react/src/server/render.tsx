import type { PageEvent } from '@marbemac/server-ssr';
import type { FC } from 'react';

import { ServerContext } from '../universal/index.js';

export interface RenderProps<T extends PageEvent = PageEvent> {
  event: T;
  Root: FC;
}

export function render({ event, Root }: RenderProps) {
  return (
    <ServerContext.Provider value={event}>
      <Root />
    </ServerContext.Provider>
  );
}
