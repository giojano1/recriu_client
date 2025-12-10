import { cookies } from "next/headers";
import { AUTH_COOKIE_CONFIG } from "@/features/auth/shared/utils/auth.config";
import {
  verificationCookieSchema,
  VerificationCookieData,
} from "../schemas/verification-cookie.schema";
import { logger } from "@/lib/utils/logger";
import { hashEmail } from "@/lib/utils/hash-pii";

export type CookieValidationResult =
  | { success: true; data: VerificationCookieData }
  | {
      success: false;
      reason: "already_verified" | "missing_cookie" | "invalid_format";
    };

export async function validateVerificationCookie(): Promise<CookieValidationResult> {
  const cookieStore = await cookies();

  // Check if already verified
  const emailVerifiedCookie = cookieStore.get(
    AUTH_COOKIE_CONFIG.VERIFIED_COOKIE_NAME
  );
  if (emailVerifiedCookie) {
    logger.info("User already verified", {
      action: "verify_page_already_verified",
    });
    return { success: false, reason: "already_verified" };
  }

  // Check for pending verification cookie
  const pendingVerificationCookie = cookieStore.get(
    AUTH_COOKIE_CONFIG.VERIFICATION_COOKIE_NAME
  );

  if (!pendingVerificationCookie) {
    logger.warn("No verification cookie found", {
      action: "verify_page_no_cookie",
    });
    return { success: false, reason: "missing_cookie" };
  }

  // Parse and validate cookie data
  try {
    const parsed = JSON.parse(pendingVerificationCookie.value);
    const cookieData = verificationCookieSchema.parse(parsed);

    logger.info("Verification page accessed", {
      action: "verify_page_accessed",
      metadata: {
        emailHash: hashEmail(cookieData.email),
        sessionId: cookieData.sessionId,
      },
    });

    return { success: true, data: cookieData };
  } catch (error) {
    logger.error("Invalid verification cookie format", {
      action: "verify_page_invalid_cookie",
      metadata: {
        error: error instanceof Error ? error.message : "Unknown error",
      },
    });
    return { success: false, reason: "invalid_format" };
  }
}
