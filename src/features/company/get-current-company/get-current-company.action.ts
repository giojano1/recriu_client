"use server";

import ServerAPI from "@/lib/api/server-api";
import { logger } from "@/lib/utils/logger";
import {
  handleAuthApiError,
  handleAuthCsrf,
} from "@/features/auth/shared/utils/error-handlers";
import {
  GetCurrentCompanyActionResult,
  GetCurrentCompanyBackendResponse,
} from "@/features/auth/shared/types";

export async function getCurrentCompanyAction(): Promise<GetCurrentCompanyActionResult> {
  try {
    // CSRF Protection: Verify origin matches host
    const csrfError = await handleAuthCsrf("get_current_company");
    if (csrfError) return csrfError;

    logger.info("Fetching current company data", {
      action: "get_current_company_attempt",
    });

    // Call backend API to get current company
    const res = await ServerAPI.get<GetCurrentCompanyBackendResponse>("/companies/me");

    const { data } = res.data;

    logger.info("Current company data retrieved successfully", {
      action: "get_current_company_success",
      metadata: {
        companyId: data.company.id,
        companyName: data.company.name,
        plan: data.company.plan,
      },
    });

    return {
      success: true,
      data,
    };
  } catch (error) {
    // Use existing error handling utilities
    return handleAuthApiError(error, {
      actionName: "get_current_company",
      defaultMessage: "Failed to fetch company data. Please try again.",
    });
  }
}
