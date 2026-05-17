import {QueryClient} from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: 0,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
      networkMode: 'offlineFirst',
    },
  },
});
