import { AxiosError } from "axios";

/**
 * Standard API error response structure
 */
export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  statusCode: number;
}

/**
 * Custom API error class
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public response?: ApiErrorResponse,
    message?: string
  ) {
    super(message || response?.message || "An error occurred");
    this.name = "ApiError";
  }
}

/**
 * Type guard to check if error is an Axios error
 */
export function isAxiosError(
  error: unknown
): error is AxiosError<ApiErrorResponse> {
  return (
    typeof error === "object" &&
    error !== null &&
    "isAxiosError" in error &&
    error.isAxiosError === true
  );
}

/**
 * Extract error message from unknown error type
 */
export function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    return (
      error.response?.data?.message || error.message || "An error occurred"
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "An unknown error occurred";
}

/**
 * Extract field-specific validation errors from API response
 */
export function getFieldErrors(
  error: unknown
): Record<string, string[]> | undefined {
  if (isAxiosError(error)) {
    return error.response?.data?.errors;
  }

  return undefined;
}
