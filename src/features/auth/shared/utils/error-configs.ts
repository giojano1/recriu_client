export type StatusHandler = {
  action: string;
  message?: string;
};

export const COMMON_AUTH_STATUS_HANDLERS = {
  422: {
    action: "backend_validation_failed",
    message: "Validation failed",
  },
  429: {
    action: "rate_limited",
    message: "Too many attempts, please try again later",
  },
} as const;

export const NETWORK_ERROR_CONFIG = {
  action: "network_error",
  message: "Network error, please check your connection and try again.",
} as const;
