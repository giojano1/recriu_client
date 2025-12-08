import {
  QueryClient,
  QueryCache,
  MutationCache,
  defaultShouldDehydrateQuery,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

const isAuthError = (error: unknown): boolean => {
  return error instanceof AxiosError && error.response?.status === 401;
};

const handleError = (error: unknown, context: "query" | "mutation") => {
  console.error(`[${context.toUpperCase()}] Error:`, error);

  if (isAuthError(error)) {
    console.warn("Authentication error detected");
  }
};

export function makeQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => handleError(error, "query"),
    }),
    mutationCache: new MutationCache({
      onError: (error) => handleError(error, "mutation"),
    }),
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        retry: (failureCount, error) => {
          if (error instanceof AxiosError) {
            const status = error.response?.status;
            if (status && status >= 400 && status < 500) {
              return false;
            }
          }

          return failureCount < 1;
        },
      },
      mutations: {
        retry: (failureCount, error) => {
          if (error instanceof AxiosError) {
            const status = error.response?.status;
            if (status && status >= 400 && status < 500) {
              return false;
            }
          }

          return failureCount < 1;
        },
      },

      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient();
  }

  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }

  return browserQueryClient;
}
