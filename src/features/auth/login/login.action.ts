"use server";

import { logger } from "@/lib/utils/logger";
import { LoginFormType, loginSchema } from "./login.schema";
import { LoginActionResult } from "../types";
import { hashEmail } from "@/lib/utils/hash-pii";
import { signIn, auth } from "@/lib/auth/auth";
import { dashboardRoutes, companyRoutes } from "@/constants/routes";
import { ZodError } from "zod";
import { AuthError } from "next-auth";
import {
  handleAuthCsrf,
  handleAuthValidationError,
} from "../utils/error-handlers";

export async function loginAction(
  data: LoginFormType
): Promise<LoginActionResult> {
  try {
    //* CSRF Protection: Verify origin matches host
    const csrfError = await handleAuthCsrf("login");
    if (csrfError) return csrfError;

    //* Validate and sanitize input data
    const validatedData = loginSchema.parse(data);

    logger.info("Login attempt via Auth.js", {
      action: "login_attempt",
      metadata: { emailHash: hashEmail(validatedData.email) },
    });

    //* Use Auth.js signIn
    const result = await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    //* Check if signIn returned null (failed authorization)
    if (!result) {
      logger.error("Login failed - Auth.js returned null", {
        action: "login_failed_null",
        metadata: { emailHash: hashEmail(validatedData.email) },
      });
      return {
        success: false,
        error: "Invalid email or password",
      };
    }

    //* Check for errors in the result
    if (result.error) {
      logger.error("Login failed with error", {
        action: "login_failed_error",
        metadata: {
          emailHash: hashEmail(validatedData.email),
          error: result.error,
        },
      });
      return {
        success: false,
        error: "Invalid email or password",
      };
    }
    logger.info("Login successful via Auth.js", {
      action: "login_success",
      metadata: {
        emailHash: hashEmail(validatedData.email),
      },
    });

    // Get fresh session to check companyId
    const session = await auth();
    const hasCompany =
      session?.companyId !== null && session?.companyId !== undefined;

    // Determine redirect based on company status
    const redirectUrl = hasCompany
      ? dashboardRoutes.DASHBOARD
      : companyRoutes.CREATE;

    return {
      success: true,
      user: {
        id: session?.user?.id || "",
        email: validatedData.email,
        firstName: session?.user?.firstName || "",
        lastName: session?.user?.lastName || "",
      },
      redirectUrl,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return handleAuthValidationError(error, "login");
    }

    if (error instanceof AuthError) {
      logger.error("Login Auth.js error", {
        action: "login_authjs_error",
        metadata: {
          type: error.type,
          message: error.message,
        },
      });

      return {
        success: false,
        error: "Invalid email or password",
      };
    }

    logger.error("Login failed with unexpected error", {
      action: "login_failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });

    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}
