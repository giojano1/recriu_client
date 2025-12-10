import {
  getErrorMessage,
  getFieldErrors,
  isAxiosError,
} from "@/lib/api/api-error";
import { logger } from "@/lib/utils/logger";
import { ZodError } from "zod";
import { validateCSRF } from "./auth.helpers";
import {
  COMMON_AUTH_STATUS_HANDLERS,
  NETWORK_ERROR_CONFIG,
  StatusHandler,
} from "./error-configs";

export async function handleAuthCsrf<
  T extends { success: false; error: string }
>(actionName: string): Promise<T | null> {
  const csrfCheck = await validateCSRF();

  if (!csrfCheck.isValid) {
    logger.error("CSRF attempt detected", {
      action: `csrf_detected_${actionName}`,
      metadata: { origin: csrfCheck.origin, host: csrfCheck.host },
    });

    return {
      success: false,
      error: "Invalid request origin",
    } as T;
  }

  return null;
}

export function handleAuthValidationError<
  T extends { success: false; error: string }
>(error: ZodError, actionName: string): T {
  logger.error(`${actionName} validation failed`, {
    action: `${actionName}_validation_failed`,
    metadata: { errors: error.issues },
  });

  const firstError = error.issues[0];
  const fieldName = firstError.path.join(".");
  const errorMessage = firstError.message;

  return {
    success: false,
    error: `${fieldName}: ${errorMessage}`,
  } as T;
}

export function handleAuthApiError<T extends { success: false; error: string }>(
  error: unknown,
  config: {
    actionName: string;
    statusHandlers?: Record<number, StatusHandler>;
    includeCommonHandlers?: boolean;
    defaultMessage?: string;
  }
): T {
  const {
    actionName,
    statusHandlers = {},
    includeCommonHandlers = true,
    defaultMessage,
  } = config;

  // Handle non-Axios errors
  if (!isAxiosError(error)) {
    const errorMessage = getErrorMessage(error);
    logger.error(`${actionName} failed`, {
      action: `${actionName}_failed`,
      metadata: { error: errorMessage },
    });
    return {
      success: false,
      error: errorMessage,
    } as T;
  }

  const statusCode = error.response?.status;
  const backendMessage = error.response?.data?.message;

  // Merge custom handlers with common handlers
  const mergedHandlers: Record<number, StatusHandler> = includeCommonHandlers
    ? { ...COMMON_AUTH_STATUS_HANDLERS, ...statusHandlers }
    : statusHandlers;

  // Check if we have a handler for this status code
  if (statusCode && mergedHandlers[statusCode]) {
    const handler = mergedHandlers[statusCode];
    const logAction = `${actionName}_${handler.action}`;

    // Special handling for 422 to include field errors
    if (statusCode === 422) {
      logger.error(`${actionName} backend validation failed`, {
        action: logAction,
        metadata: {
          statusCode,
          errors: getFieldErrors(error),
        },
      });
    } else {
      logger.error(`${actionName} ${handler.action}`, {
        action: logAction,
        metadata: { statusCode },
      });
    }

    return {
      success: false,
      error:
        backendMessage ||
        handler.message ||
        defaultMessage ||
        "An error occurred",
    } as T;
  }

  // Handle network errors (no response)
  if (!error.response) {
    logger.error(`${actionName} network error`, {
      action: `${actionName}_${NETWORK_ERROR_CONFIG.action}`,
      metadata: {
        error: error.message,
        code: error.code,
      },
    });
    return {
      success: false,
      error: NETWORK_ERROR_CONFIG.message,
    } as T;
  }

  // Generic error fallback
  const errorMessage = getErrorMessage(error);
  logger.error(`${actionName} failed`, {
    action: `${actionName}_failed`,
    metadata: {
      error: errorMessage,
      statusCode,
    },
  });

  return {
    success: false,
    error: errorMessage,
  } as T;
}
