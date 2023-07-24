import type { AnyRouter } from '@marbemac/client-trpc';
import { createContext, useContext } from 'react';

import type { CreateTRPCReact } from './createTRPCReact.ts';

export const createTRPCProvider = <TRouter extends AnyRouter>() => {
  const TrpcContext = createContext<{ trpc?: CreateTRPCReact<TRouter> }>({});

  function useTrpc() {
    const context = useContext(TrpcContext);

    if (context === undefined) {
      throw new Error('`useTrpc` must be used within a `TrpcProvider`');
    }

    return context.trpc!;
  }

  return { TrpcContext, useTrpc };
};
