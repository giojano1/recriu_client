"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentCompanyAction } from "./get-current-company.action";
import { queryKeys } from "@/lib/utils/query-keys";
import { logger } from "@/lib/utils/logger";

export function useGetCurrentCompany() {
  return useQuery({
    queryKey: queryKeys.company.current(),
    queryFn: async () => {
      const result = await getCurrentCompanyAction();

      // Handle action errors
      if (!result.success) {
        logger.error("Failed to fetch current company", {
          action: "get_current_company_query_error",
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

export function useInvalidateCurrentCompany() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.company.current() });
  };
}

export function useRefetchCurrentCompany() {
  const queryClient = useQueryClient();

  return () => {
    return queryClient.refetchQueries({ queryKey: queryKeys.company.current() });
  };
}
