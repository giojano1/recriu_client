"use server";

import { auth } from "@/lib/auth/auth";
import { logger } from "@/lib/utils/logger";
import { handleAuthCsrf } from "../shared/utils/error-handlers";
import { authRoutes } from "@/constants/routes";
import type { LogoutActionResult } from "../shared/types";
import { cookies } from "next/headers";

/**
 * Logout Server Action
 *
 * Implements secure logout functionality with:
 * - CSRF protection
 * - Manual NextAuth session cookie cleanup
 * - Proper logging
 * - Error handling
 *
 * This action manually clears NextAuth cookies:
 * 1. Clears the session token cookie (next-auth.session-token)
 * 2. Clears the CSRF token cookie
 * 3. Clears the callback URL cookie
 * 4. Returns redirect URL for client-side navigation
 *
 * Note: We manually delete cookies instead of using signOut() to avoid
 * redirect errors in Next.js 16 server actions.
 *
 * Additional cleanup (TanStack Query cache, client state) should be
 * handled on the client side before calling this action.
 */
export async function logoutAction(): Promise<LogoutActionResult> {
  // CSRF Protection: Verify origin matches host
  const csrfError = await handleAuthCsrf<LogoutActionResult>("logout");
  if (csrfError) return csrfError;

  logger.info("Logout attempt initiated", {
    action: "logout_attempt",
  });

  try {
    // Get current session for logging
    const session = await auth();
    if (session?.user) {
      logger.info("Logging out user", {
        action: "logout_user",
        metadata: { userId: session.user.id },
      });
    }

    // Manually clear NextAuth session cookies
    // This is more reliable than signOut() in server actions which can cause redirect errors
    const cookieStore = await cookies();

    // Clear all NextAuth related cookies
    cookieStore.delete("next-auth.session-token");
    cookieStore.delete("next-auth.csrf-token");
    cookieStore.delete("next-auth.callback-url");

    // Also try the __Secure- prefixed versions (used in production with HTTPS)
    cookieStore.delete("__Secure-next-auth.session-token");
    cookieStore.delete("__Secure-next-auth.csrf-token");
    cookieStore.delete("__Secure-next-auth.callback-url");

    logger.info("User logged out successfully", {
      action: "logout_success",
    });

    return {
      success: true,
      redirectUrl: authRoutes.LOGIN,
    };
  } catch (error) {
    logger.error("Logout failed with unexpected error", {
      action: "logout_failed",
      error: error instanceof Error ? error.message : "Unknown error",
      metadata: {
        errorType: error instanceof Error ? error.constructor.name : typeof error,
      },
    });

    return {
      success: false,
      error: "Failed to log out. Please try again.",
    };
  }
}
