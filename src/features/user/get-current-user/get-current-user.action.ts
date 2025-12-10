"use server";

import ServerAPI from "@/lib/api/server-api";
import { logger } from "@/lib/utils/logger";
import {
  handleAuthApiError,
  handleAuthCsrf,
} from "@/features/auth/shared/utils/error-handlers";
import {
  GetCurrentUserActionResult,
  GetCurrentUserBackendResponse,
} from "@/features/auth/shared/types";

export async function getCurrentUserAction(): Promise<GetCurrentUserActionResult> {
  try {
    // CSRF Protection: Verify origin matches host
    const csrfError = await handleAuthCsrf("get_current_user");
    if (csrfError) return csrfError;

    logger.info("Fetching current user data", {
      action: "get_current_user_attempt",
    });

    // Call backend API to get current user
    const res = await ServerAPI.get<GetCurrentUserBackendResponse>("/users/me");

    const { data } = res.data;

    logger.info("Current user data retrieved successfully", {
      action: "get_current_user_success",
      metadata: {
        userId: data.user.id,
        hasCompany: data.company !== null,
        role: data.role,
      },
    });

    return {
      success: true,
      data,
    };
  } catch (error) {
    // Use existing error handling utilities
    return handleAuthApiError(error, {
      actionName: "get_current_user",
      defaultMessage: "Failed to fetch user data. Please try again.",
    });
  }
}
