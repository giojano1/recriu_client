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

  // Prefetch current user data
  const queryClient = getQueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.user.current(),
      queryFn: async () => {
        const result = await getCurrentUserAction();

        if (!result.success) {
          logger.warn("Failed to prefetch user data", {
            action: "prefetch_current_user_failed",
            metadata: { error: result.error },
          });
          return null;
        }

        return result.data;
      },
      staleTime: 60 * 1000,
    });
  } catch (error) {
    logger.error("Error during user data prefetch", {
      action: "prefetch_current_user_error",
      metadata: {
        error: error instanceof Error ? error.message : "Unknown error",
      },
    });
  }

  // Prefetch current company data
  try {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.company.current(),
      queryFn: async () => {
        const result = await getCurrentCompanyAction();

        if (!result.success) {
          logger.warn("Failed to prefetch company data", {
            action: "prefetch_current_company_failed",
            metadata: { error: result.error },
          });
          return null;
        }

        return result.data;
      },
      staleTime: 60 * 1000,
    });
  } catch (error) {
    logger.error("Error during company data prefetch", {
      action: "prefetch_current_company_error",
      metadata: {
        error: error instanceof Error ? error.message : "Unknown error",
      },
    });
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
