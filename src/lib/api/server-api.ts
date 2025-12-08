import { env } from "@/config/env";
import { auth } from "@/lib/auth/auth";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

interface RetryConfig extends InternalAxiosRequestConfig {
  retryCount?: number;
  _retryStartTime?: number;
}

const ServerAPI = axios.create({
  baseURL: env.API_URL,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": env.API_KEY,
  },
  timeout: 10000, // 10 second timeout
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

// Helper to determine if request should be retried
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

  // Retry on specific 5xx server errors
  if (error.response?.status) {
    const retryableStatuses = [500, 502, 503, 504];
    return retryableStatuses.includes(error.response.status);
  }

  return false;
}

// Helper for exponential backoff with jitter
function getRetryDelay(retryCount: number): number {
  const exponentialDelay = RETRY_DELAY * Math.pow(2, retryCount);
  const cappedDelay = Math.min(exponentialDelay, MAX_RETRY_DELAY);
  const jitter = Math.random() * 0.3 * cappedDelay;
  return cappedDelay + jitter;
}

// Helper to check if request is to refresh endpoint (prevent circular refresh)
function isRefreshEndpoint(config: RetryConfig): boolean {
  return config.url?.includes("/auth/refresh") || false;
}

// Response interceptor for error handling and retries
ServerAPI.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryConfig;

    if (!config) {
      return Promise.reject(error);
    }

    // Initialize retry count and start time
    if (config.retryCount === undefined) {
      config.retryCount = 0;
      config._retryStartTime = Date.now();
    }

    if (
      error.response?.status === 401 &&
      !isRefreshEndpoint(config) &&
      !config.headers?.["X-No-Retry"]
    ) {
      // Log for debugging
      if (process.env.NODE_ENV === "development") {
        console.warn("[Server API] 401 Unauthorized - Token may have expired");
      }
    }

    // Log server-side API errors (structured logging)
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

    // Check if we should retry
    if (config.retryCount < MAX_RETRIES && shouldRetry(error, config)) {
      config.retryCount += 1;

      // Wait with exponential backoff + jitter
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

      // Retry the request
      return ServerAPI(config);
    }

    // All retries exhausted or non-retryable error
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
