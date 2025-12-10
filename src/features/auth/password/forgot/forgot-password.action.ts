"use server";
import { getErrorMessage, getFieldErrors } from "@/lib/api/api-error";
import ServerAPI from "@/lib/api/server-api";
import { hashEmail } from "@/lib/utils/hash-pii";
import { logger } from "@/lib/utils/logger";
import { isAxiosError } from "axios";
import { ZodError } from "zod";
import { ForgotPasswordActionResult } from "../../shared/types";
import { validateCSRF } from "../../shared/utils/auth.helpers";
import forgotPasswordSchema, {
  ForgotPasswordFormType,
} from "./forgot-password.schema";

export async function forgotPasswordAction(
  data: ForgotPasswordFormType
): Promise<ForgotPasswordActionResult> {
  try {
    //* CSRF Protection: Verify origin matches host
    const csrfCheck = await validateCSRF();
    if (!csrfCheck.isValid) {
      logger.error("CSRF attempt detected", {
        action: "csrf_detected_forgot_password",
        metadata: { origin: csrfCheck.origin, host: csrfCheck.host },
      });
      return {
        success: false,
        error: "Invalid request origin",
      };
    }

    //* Validate and sanitize input data
    const validatedData = forgotPasswordSchema.parse(data);

    logger.info("Forgot password attempt", {
      action: "forgot_password_attempt",
      metadata: { emailHash: hashEmail(validatedData.email) },
    });

    await ServerAPI.post("/auth/password/forgot", {
      email: validatedData.email,
    });

    logger.info("Forgot password email sent", {
      action: "forgot_password_email_sent",
      metadata: { emailHash: hashEmail(validatedData.email) },
    });

    return {
      success: true,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return handleForgotPasswordValidationError(error);
    }

    return handleForgotPasswordApiError(error, data.email);
  }
}

function handleForgotPasswordApiError(
  error: unknown,
  email: string
): ForgotPasswordActionResult {
  if (!isAxiosError(error)) {
    const errorMessage = getErrorMessage(error);
    logger.error("Forgot password failed", {
      action: "forgot_password_failed",
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
    case 400: // Invalid email format
      logger.error("Forgot password invalid email", {
        action: "forgot_password_invalid_email",
        metadata: { statusCode, emailHash: hashEmail(email) },
      });
      return {
        success: false,
        error: backendMessage || "Invalid email address",
      };

    case 404: // Email not found - return success to avoid user enumeration
      logger.warn("Forgot password email not found", {
        action: "forgot_password_not_found",
        metadata: { statusCode, emailHash: hashEmail(email) },
      });
      // Security: Don't reveal if email exists or not
      return {
        success: true,
      };

    case 422: // Validation error from backend
      logger.error("Forgot password backend validation failed", {
        action: "forgot_password_backend_validation_failed",
        metadata: {
          statusCode,
          emailHash: hashEmail(email),
          errors: getFieldErrors(error),
        },
      });
      return {
        success: false,
        error: backendMessage || "Validation failed",
      };

    case 429: // Rate limiting
      logger.error("Forgot password rate limited", {
        action: "forgot_password_rate_limited",
        metadata: { statusCode, emailHash: hashEmail(email) },
      });
      return {
        success: false,
        error: backendMessage || "Too many requests. Please try again later.",
      };

    default:
      // Network error (no response)
      if (!error.response) {
        logger.error("Forgot password network error", {
          action: "forgot_password_network_error",
          metadata: {
            error: error.message,
            code: error.code,
            emailHash: hashEmail(email),
          },
        });
        return {
          success: false,
          error: "Network error, please check your connection and try again.",
        };
      }

      // Generic error
      const errorMessage = getErrorMessage(error);
      logger.error("Forgot password failed", {
        action: "forgot_password_failed",
        metadata: {
          error: errorMessage,
          statusCode,
          emailHash: hashEmail(email),
        },
      });
      return {
        success: false,
        error: errorMessage,
      };
  }
}
function handleForgotPasswordValidationError(
  error: ZodError
): ForgotPasswordActionResult {
  logger.error("Forgot password validation failed", {
    action: "forgot_password_validation_failed",
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
