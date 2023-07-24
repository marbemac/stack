import { QueryClient } from '@tanstack/react-query';

export const createQueryClient = () => {
  const queryClient: QueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 1000 * 30,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
      },
    },
  });

  return queryClient;
};
