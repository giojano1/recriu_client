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
      logger.info("Received 401, attempting to refresh session via NextAuth", {
        action: "server_api_401_refresh_nextauth",
      });

      try {
        // Force NextAuth to re-evaluate session (triggers JWT callback if needed)
        const freshSession = await auth();

        if (freshSession?.accessToken && !freshSession.error) {
          // Mark this as a retry after 401 to prevent infinite loops
          config._isRetryAfter401 = true;

          // Update the Authorization header with fresh token from session
          config.headers.Authorization = `Bearer ${freshSession.accessToken}`;

          logger.info("Retrying request with fresh session token", {
            action: "server_api_retry_with_nextauth_token",
          });

          // Retry the request with new token
          return ServerAPI(config);
        } else {
          logger.error("Session refresh failed or has error", {
            action: "server_api_session_refresh_failed",
            metadata: { hasError: freshSession?.error },
          });
          // Return 401 error to trigger sign out in client
          return Promise.reject(error);
        }
      } catch (refreshError) {
        logger.error("Failed to get fresh session", {
          action: "server_api_session_fetch_failed",
          error:
            refreshError instanceof Error
              ? refreshError.message
              : "Unknown error",
        });
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
