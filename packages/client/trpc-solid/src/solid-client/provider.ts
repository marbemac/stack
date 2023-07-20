import type { AnyRouter } from '@marbemac/client-trpc';
import { createContext, useContext } from 'solid-js';
import { CreateTRPCSolid } from './createTRPCSolid.ts';

export const createTRPCProvider = <TRouter extends AnyRouter>() => {
  const TrpcContext = createContext<{ trpc: CreateTRPCSolid<TRouter> }>();

  function useTrpc() {
    const context = useContext(TrpcContext);

    if (context === undefined) {
      throw new Error('`useTrpc` must be used within a `TrpcProvider`');
    }

    return context.trpc;
  }

  return { TrpcContext, useTrpc };
};
