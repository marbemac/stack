import type { AnyRouter } from '@marbemac/client-trpc';
import { createContext, useContext } from 'react';

export const TrpcCallerContext = createContext<{ caller?: ReturnType<AnyRouter['createCaller']> }>({});

export function useTrpcCaller() {
  const context = useContext(TrpcCallerContext);

  if (context === undefined) {
    throw new Error('`useTrpcCaller` must be used within a `TrpcCallerProvider`');
  }

  return context;
}
