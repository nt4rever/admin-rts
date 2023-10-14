export const config = {
  defaultOptions: {
    queries: {
      staleTime: 0,
      cacheTime: 5 * 60 * 1000,
      refetchOnWindowFocus: true,
    },
  },
};
