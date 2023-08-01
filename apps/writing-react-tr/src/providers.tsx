import type { QueryClient } from '@tanstack/react-query';
import { QueryClientProvider } from '@tanstack/react-query';

import type { createTRPCClient } from './utils/trpc.ts';
import { TrpcContext } from './utils/trpc.ts';

export type ProviderProps = {
  queryClient: QueryClient;
  trpc: ReturnType<typeof createTRPCClient>;
  children: React.ReactNode;
};

export const Providers = ({ children, queryClient, trpc }: ProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <TrpcContext.Provider value={{ trpc }}>{children}</TrpcContext.Provider>
    </QueryClientProvider>
  );
};
