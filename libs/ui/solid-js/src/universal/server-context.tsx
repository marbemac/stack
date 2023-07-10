import { createContext, useContext } from 'solid-js';

import type { PageEvent } from './types.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ServerContext = createContext<PageEvent>({} as any);

export const useRequest = <T extends PageEvent = PageEvent>() => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return useContext(ServerContext)! as Readonly<T>;
};
