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

const isServerActionError = (error: unknown): boolean => {
  return (
    error instanceof Error &&
    error.message.includes("An unexpected response was received from the server")
  );
};

const handleError = (error: unknown, context: "query" | "mutation") => {
  // Suppress server action redirect errors - these are expected during navigation
  if (isServerActionError(error)) {
    console.log(
      `[${context.toUpperCase()}] Server action redirect detected (expected during logout/navigation)`
    );
    return;
  }

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
          // Don't retry server action redirect errors
          if (isServerActionError(error)) {
            return false;
          }

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
          // Don't retry server action redirect errors
          if (isServerActionError(error)) {
            return false;
          }

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
