import { authRoutes } from "@/constants/routes";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/utils/query-client";
import { queryKeys } from "@/lib/utils/query-keys";
import { getCurrentUserAction } from "@/features/user/get-current-user/get-current-user.action";
import { getCurrentCompanyAction } from "@/features/company/get-current-company/get-current-company.action";
import { logger } from "@/lib/utils/logger";

export default async function PrivateRoutesLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (
    !session ||
    !session.user ||
    session.error === "RefreshAccessTokenError"
  ) {
    redirect(authRoutes.LOGIN);
  }

  // Prefetch current user and company data in parallel with coordination
  const queryClient = getQueryClient();

  // Run both prefetches in parallel and capture all results
  const results = await Promise.allSettled([
    queryClient.prefetchQuery({
      queryKey: queryKeys.user.current(),
      queryFn: async () => {
        const result = await getCurrentUserAction();

        if (!result.success) {
          logger.warn("Failed to prefetch user data", {
            action: "prefetch_current_user_failed",
            metadata: { error: result.error },
          });

          // Throw to mark this prefetch as failed
          throw new Error(result.error);
        }

        return result.data;
      },
      staleTime: 60 * 1000,
    }),

    queryClient.prefetchQuery({
      queryKey: queryKeys.company.current(),
      queryFn: async () => {
        const result = await getCurrentCompanyAction();

        if (!result.success) {
          logger.warn("Failed to prefetch company data", {
            action: "prefetch_current_company_failed",
            metadata: { error: result.error },
          });

          // Throw to mark this prefetch as failed
          throw new Error(result.error);
        }

        return result.data;
      },
      staleTime: 60 * 1000,
    }),
  ]);

  // Check if any prefetch failed due to authentication
  // Auth errors typically contain "unauthorized", "token", or "session" keywords
  const hasAuthError = results.some((result) => {
    if (result.status === "rejected") {
      const errorMessage = result.reason?.message?.toLowerCase() || "";
      return (
        errorMessage.includes("unauthorized") ||
        errorMessage.includes("token") ||
        errorMessage.includes("session") ||
        errorMessage.includes("authentication")
      );
    }
    return false;
  });

  // If auth error detected, force redirect to login
  if (hasAuthError) {
    logger.error("Authentication error during prefetch, redirecting to login", {
      action: "prefetch_auth_error_redirect",
    });
    redirect(authRoutes.LOGIN);
  }

  // Log any non-auth errors (data will be fetched client-side)
  results.forEach((result, index) => {
    if (result.status === "rejected") {
      const queryName = index === 0 ? "user" : "company";
      logger.error(`Error during ${queryName} data prefetch`, {
        action: `prefetch_current_${queryName}_error`,
        metadata: {
          error:
            result.reason instanceof Error
              ? result.reason.message
              : "Unknown error",
        },
      });
    }
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
