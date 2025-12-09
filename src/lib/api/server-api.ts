import { env } from "@/config/env";
import { auth } from "@/lib/auth/auth";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { logger } from "@/lib/utils/logger";

interface RetryConfig extends InternalAxiosRequestConfig {
  retryCount?: number;
  _retryStartTime?: number;
  _isRetryAfter401?: boolean;
}

const ServerAPI = axios.create({
  baseURL: env.API_URL,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": env.API_KEY,
  },
  timeout: 10000,
});

// Request interceptor
ServerAPI.interceptors.request.use(
  async (config) => {
    try {
      if (config.headers.Authorization) {
        return config;
      }

      const session = await auth();

      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      }

      return config;
    } catch (error) {
      console.error("Failed to get session:", error);
      return config;
    }
  },
  (error) => Promise.reject(error)
);

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;
const MAX_RETRY_DELAY = 10000;

function shouldRetry(error: AxiosError, config: RetryConfig): boolean {
  if (config.headers?.["X-No-Retry"]) {
    return false;
  }

  const idempotentMethods = ["GET", "HEAD", "OPTIONS", "PUT", "DELETE"];
  if (!idempotentMethods.includes(config.method?.toUpperCase() || "")) {
    return false;
  }

  if (!error.response && error.code) {
    const retryableErrors = [
      "ECONNREFUSED",
      "ETIMEDOUT",
      "ENOTFOUND",
      "ENETUNREACH",
      "EAI_AGAIN",
      "ECONNRESET",
    ];
    return retryableErrors.includes(error.code);
  }

  if (error.response?.status) {
    const retryableStatuses = [500, 502, 503, 504];
    return retryableStatuses.includes(error.response.status);
  }

  return false;
}

function getRetryDelay(retryCount: number): number {
  const exponentialDelay = RETRY_DELAY * Math.pow(2, retryCount);
  const cappedDelay = Math.min(exponentialDelay, MAX_RETRY_DELAY);
  const jitter = Math.random() * 0.3 * cappedDelay;
  return cappedDelay + jitter;
}

function isRefreshEndpoint(config: RetryConfig): boolean {
  return config.url?.includes("/auth/refresh") || false;
}

// NEW: Helper to manually refresh the session
async function refreshSession(): Promise<string | null> {
  try {
    logger.info("Manually triggering token refresh", {
      action: "manual_token_refresh",
    });

    // Get current session to extract refresh token
    const currentSession = await auth();

    if (!currentSession?.refreshToken) {
      logger.error("No refresh token available for manual refresh", {
        action: "manual_token_refresh_failed",
      });
      return null;
    }

    // Call refresh endpoint directly
    const response = await axios.post(
      `${env.API_URL}/auth/refresh`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": env.API_KEY,
          Cookie: `refreshToken=${currentSession.refreshToken}`,
          "X-Server-Refresh": "true",
        },
        timeout: 10000,
      }
    );

    if (!response.data?.tokens?.accessToken) {
      logger.error("Invalid refresh response", {
        action: "manual_token_refresh_failed",
      });
      return null;
    }

    logger.info("Token refreshed successfully", {
      action: "manual_token_refresh_success",
    });

    return response.data.tokens.accessToken;
  } catch (error) {
    logger.error("Failed to manually refresh token", {
      action: "manual_token_refresh_failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return null;
  }
}

// Response interceptor
ServerAPI.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryConfig;

    if (!config) {
      return Promise.reject(error);
    }

    // Initialize retry tracking
    if (config.retryCount === undefined) {
      config.retryCount = 0;
      config._retryStartTime = Date.now();
    }

    // Handle 401 errors (token expired)
    if (
      error.response?.status === 401 &&
      !isRefreshEndpoint(config) &&
      !config.headers?.["X-No-Retry"] &&
      !config._isRetryAfter401 // Prevent infinite loops
    ) {
      logger.info("Received 401, attempting token refresh", {
        action: "server_api_401_refresh",
      });

      // Try to refresh the token
      const newAccessToken = await refreshSession();

      if (newAccessToken) {
        // Mark this as a retry after 401 to prevent infinite loops
        config._isRetryAfter401 = true;

        // Update the Authorization header with new token
        config.headers.Authorization = `Bearer ${newAccessToken}`;

        logger.info("Retrying request with new token", {
          action: "server_api_retry_with_new_token",
        });

        // Retry the request with new token
        return ServerAPI(config);
      } else {
        logger.error("Token refresh failed, cannot retry request", {
          action: "server_api_refresh_failed",
        });
        // Return 401 error to trigger sign out in client
        return Promise.reject(error);
      }
    }

    // Log errors in development
    if (process.env.NODE_ENV === "development") {
      console.error("[Server API Error]", {
        url: config.url,
        method: config.method?.toUpperCase(),
        status: error.response?.status,
        statusText: error.response?.statusText,
        errorCode: error.code,
        message: error.message,
        retryCount: config.retryCount,
        elapsedTime: config._retryStartTime
          ? `${Date.now() - config._retryStartTime}ms`
          : undefined,
      });
    }

    // Check if we should retry (for other errors)
    if (config.retryCount < MAX_RETRIES && shouldRetry(error, config)) {
      config.retryCount += 1;

      const delay = getRetryDelay(config.retryCount);
      await new Promise((resolve) => setTimeout(resolve, delay));

      if (process.env.NODE_ENV === "development") {
        console.log(
          `[Server API Retry] Attempt ${
            config.retryCount
          }/${MAX_RETRIES} after ${Math.round(delay)}ms:`,
          config.url
        );
      }

      return ServerAPI(config);
    }

    // All retries exhausted
    if (config.retryCount >= MAX_RETRIES) {
      console.error(
        `[Server API] Max retries (${MAX_RETRIES}) exhausted for:`,
        config.url
      );
    }

    return Promise.reject(error);
  }
);

export default ServerAPI;
