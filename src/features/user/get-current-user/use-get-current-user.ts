"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUserAction } from "./get-current-user.action";
import { queryKeys } from "@/lib/utils/query-keys";
import { logger } from "@/lib/utils/logger";

export function useGetCurrentUser() {
  return useQuery({
    queryKey: queryKeys.user.current(),
    queryFn: async () => {
      const result = await getCurrentUserAction();

      // Handle action errors
      if (!result.success) {
        logger.error("Failed to fetch current user", {
          action: "get_current_user_query_error",
          metadata: { error: result.error },
        });
        throw new Error(result.error);
      }

      return result.data;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 60 * 1000, // 1 minute
    retry: 1, // Max 1 retry
  });
}

export function useInvalidateCurrentUser() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.user.current() });
  };
}

export function useRefetchCurrentUser() {
  const queryClient = useQueryClient();

  return () => {
    return queryClient.refetchQueries({ queryKey: queryKeys.user.current() });
  };
}
