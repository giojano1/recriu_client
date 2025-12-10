"use server";

import { dashboardRoutes } from "@/constants/routes";
import {
  handleAuthApiError,
  handleAuthCsrf,
  handleAuthValidationError,
} from "@/features/auth/shared/utils/error-handlers";
import ServerAPI from "@/lib/api/server-api";
import { logger } from "@/lib/utils/logger";
import { ZodError } from "zod";
import {
  CreateCompanyActionResult,
  CreateCompanyResponse,
} from "../shared/types";
import { hashCompanySlug } from "../shared/utils/hash-company";
import {
  CreateCompanyFormType,
  createCompanySchema,
} from "./create-company.schema";

export async function createCompanyAction(
  data: CreateCompanyFormType
): Promise<CreateCompanyActionResult> {
  try {
    //* CSRF Protection: Verify origin matches host
    const csrfError = await handleAuthCsrf("create_company");
    if (csrfError) return csrfError;

    //* Validate and sanitize input data
    const validatedData = createCompanySchema.parse(data);

    logger.info("Company creation attempt", {
      action: "create_company_attempt",
      metadata: { slugHash: hashCompanySlug(validatedData.slug) },
    });

    //* Call backend API to create company
    const res = await ServerAPI.post<CreateCompanyResponse>(
      "/companies",
      validatedData
    );

    const { id } = res.data.data;

    logger.info("Company created successfully", {
      action: "create_company_success",
      metadata: {
        companyId: id,
      },
    });

    return {
      success: true,
      companyId: id,
      redirectUrl: dashboardRoutes.DASHBOARD,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return handleAuthValidationError(error, "create_company");
    }

    return handleAuthApiError(error, {
      actionName: "create_company",
      statusHandlers: {
        409: {
          action: "duplicate_slug",
          message: "This company slug is already taken. Please choose another.",
        },
      },
    });
  }
}
