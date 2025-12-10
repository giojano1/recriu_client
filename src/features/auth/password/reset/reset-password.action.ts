"use server";

import { logger } from "@/lib/utils/logger";
import { ResetPasswordActionResult } from "../../shared/types";
import { validateCSRF } from "../../shared/utils/auth.helpers";
import resetPasswordSchema, {
  ResetPasswordFormType,
} from "./reset-password.schema";
import ServerAPI from "@/lib/api/server-api";
import { authRoutes } from "@/constants/routes";
import { ZodError } from "zod";
import { isAxiosError } from "axios";
import { getErrorMessage, getFieldErrors } from "@/lib/api/api-error";

export async function resetPasswordAction(
  token: string,
  data: ResetPasswordFormType
): Promise<ResetPasswordActionResult> {
  try {
    //* CSRF Protection: Verify origin matches host
    const csrfCheck = await validateCSRF();
    if (!csrfCheck.isValid) {
      logger.error("CSRF attempt detected", {
        action: "csrf_detected_reset_password",
        metadata: { origin: csrfCheck.origin, host: csrfCheck.host },
      });
      return {
        success: false,
        error: "Invalid request origin",
      };
    }

    //* Validate token parameter
    if (!token || typeof token !== "string" || token.trim().length === 0) {
      logger.error("Reset password invalid token", {
        action: "reset_password_invalid_token",
        metadata: { tokenProvided: !!token },
      });
      return {
        success: false,
        error: "Invalid reset token",
      };
    }

    //* Validate and sanitize input data
    const validatedData = resetPasswordSchema.parse(data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...dataToSend } = validatedData;

    logger.info("Reset password attempt", {
      action: "reset_password_attempt",
      metadata: { tokenLength: token.length },
    });

    await ServerAPI.post(
      `/auth/password/reset?token=${encodeURIComponent(token.trim())}`,
      {
        newPassword: dataToSend.password,
      }
    );

    logger.info("Reset password successful", {
      action: "reset_password_success",
    });

    return {
      success: true,
      redirectUrl: authRoutes.LOGIN,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return handleResetPasswordValidationError(error);
    }

    return handleResetPasswordApiError(error);
  }
}

function handleResetPasswordApiError(
  error: unknown
): ResetPasswordActionResult {
  if (!isAxiosError(error)) {
    const errorMessage = getErrorMessage(error);
    logger.error("Reset password failed", {
      action: "reset_password_failed",
      metadata: { error: errorMessage },
    });
    return {
      success: false,
      error: errorMessage,
    };
  }

  const statusCode = error.response?.status;
  const backendMessage = error.response?.data?.message;

  // Handle specific error cases
  switch (statusCode) {
    case 400: // Invalid token format
      logger.error("Reset password invalid token format", {
        action: "reset_password_invalid_token_format",
        metadata: { statusCode },
      });
      return {
        success: false,
        error: backendMessage || "Invalid reset token format",
      };

    case 401: // Invalid or expired token
      logger.error("Reset password token invalid", {
        action: "reset_password_token_invalid",
        metadata: { statusCode },
      });
      return {
        success: false,
        error: backendMessage || "Invalid or expired reset token",
      };

    case 410: // Token expired
      logger.error("Reset password token expired", {
        action: "reset_password_token_expired",
        metadata: { statusCode },
      });
      return {
        success: false,
        error:
          backendMessage || "Reset link has expired. Please request a new one.",
      };

    case 422: // Validation error from backend
      logger.error("Reset password backend validation failed", {
        action: "reset_password_backend_validation_failed",
        metadata: {
          statusCode,
          errors: getFieldErrors(error),
        },
      });
      return {
        success: false,
        error: backendMessage || "Validation failed",
      };

    case 429: // Rate limiting
      logger.error("Reset password rate limited", {
        action: "reset_password_rate_limited",
        metadata: { statusCode },
      });
      return {
        success: false,
        error: backendMessage || "Too many attempts. Please try again later.",
      };

    default:
      // Network error (no response)
      if (!error.response) {
        logger.error("Reset password network error", {
          action: "reset_password_network_error",
          metadata: {
            error: error.message,
            code: error.code,
          },
        });
        return {
          success: false,
          error: "Network error, please check your connection and try again.",
        };
      }

      // Generic error
      const errorMessage = getErrorMessage(error);
      logger.error("Reset password failed", {
        action: "reset_password_failed",
        metadata: {
          error: errorMessage,
          statusCode,
        },
      });
      return {
        success: false,
        error: errorMessage,
      };
  }
}
function handleResetPasswordValidationError(
  error: ZodError
): ResetPasswordActionResult {
  logger.error("Reset password validation failed", {
    action: "reset_password_validation_failed",
    metadata: { errors: error.issues },
  });

  const firstError = error.issues[0];
  const fieldName = firstError.path.join(".");
  const errorMessage = firstError.message;

  return {
    success: false,
    error: `${fieldName}: ${errorMessage}`,
  };
}
