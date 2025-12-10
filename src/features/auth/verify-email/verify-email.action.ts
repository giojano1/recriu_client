"use server";

import { logger } from "@/lib/utils/logger";
import verifyEmailOtpSchema, {
  VerifyEmailOtpFormType,
} from "./otp/schemas/verify-email-otp.schema";
import {
  ResendOtpActionResult,
  VerifyEmailActionResult,
  VerifyEmailResponse,
  VerifyEmailTokenActionResult,
  VerifyEmailTokenResponse,
} from "../shared/types";
import { hashEmail } from "@/lib/utils/hash-pii";
import ServerAPI from "@/lib/api/server-api";
import { authRoutes } from "@/constants/routes";
import { ZodError } from "zod";
import { cookies } from "next/headers";
import { AUTH_COOKIE_CONFIG } from "../shared/utils/auth.config";
import { revalidatePath } from "next/cache";
import { resendOtpSchema } from "./otp/schemas/resend-email.schema";
import {
  handleAuthCsrf,
  handleAuthValidationError,
  handleAuthApiError,
} from "../shared/utils/error-handlers";

export async function verifyEmailOtpAction(
  data: VerifyEmailOtpFormType
): Promise<VerifyEmailActionResult> {
  try {
    //* CSRF Protection: Verify origin matches host
    const csrfError = await handleAuthCsrf("verify_email_otp");
    if (csrfError) return csrfError;

    //* Validate and sanitize input data
    const validatedData = verifyEmailOtpSchema.parse(data);

    logger.info("Email verification attempt", {
      action: "verify_email_attempt",
      metadata: { emailHash: hashEmail(validatedData.email) },
    });

    const res = await ServerAPI.post<VerifyEmailResponse>(
      "/auth/verify-email/otp",
      {
        email: validatedData.email,
        code: validatedData.otp,
      }
    );

    const { success } = res.data;

    logger.info("Email verification successful", {
      action: "verify_email_success",
      metadata: { emailHash: hashEmail(validatedData.email), success },
    });

    await setVerifiedCookie();
    await cleanupVerificationCookies();

    // Revalidate cache after successful verification
    revalidatePath("/login");

    return {
      success: true,
      verified: true,
      redirectUrl: authRoutes.LOGIN,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return handleAuthValidationError(error, "verify_email");
    }

    return handleAuthApiError(error, {
      actionName: "verify_email",
      statusHandlers: {
        400: {
          action: "invalid_otp_format",
          message: "Invalid verification code format",
        },
        401: {
          action: "otp_invalid",
          message: "Invalid or expired verification code",
        },
        404: {
          action: "not_found",
          message: "Email not found or already verified",
        },
      },
    });
  }
}
export async function resendOtpAction(
  email: string
): Promise<ResendOtpActionResult> {
  try {
    //* CSRF Protection: Verify origin matches host
    const csrfError = await handleAuthCsrf("resend_otp");
    if (csrfError) return csrfError;

    //* Validate and sanitize input data
    const validatedEmail = resendOtpSchema.parse(email);

    logger.info("Resend OTP attempt", {
      action: "resend_otp_attempt",
      metadata: { emailHash: hashEmail(validatedEmail) },
    });

    await ServerAPI.post("/auth/verify-email/resend", {
      email: validatedEmail,
    });

    logger.info("Resend OTP successful", {
      action: "resend_otp_success",
      metadata: { emailHash: hashEmail(validatedEmail) },
    });

    return {
      success: true,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return handleAuthValidationError(error, "resend_otp");
    }

    return handleAuthApiError(error, {
      actionName: "resend_otp",
      statusHandlers: {
        400: {
          action: "invalid_format",
          message: "Invalid email format",
        },
        404: {
          action: "not_found",
          message: "Email not found",
        },
      },
    });
  }
}

// export async function verifyEmailTokenAction(
//   token: string
// ): Promise<VerifyEmailTokenActionResult> {
//   try {
//     //* CSRF Protection: Verify origin matches host
//     const csrfError = await handleAuthCsrf("verify_email_token");
//     if (csrfError) return csrfError;

//     //* Validate and sanitize input data
//     const validatedData = verifyEmailTokenSchema.parse({ token });

//     logger.info("Email token verification attempt", {
//       action: "verify_email_token_attempt",
//       metadata: { tokenLength: validatedData.token.length },
//     });

//     const res = await ServerAPI.post<VerifyEmailTokenResponse>(
//       `/auth/verify-email/token?token=${validatedData.token}`
//     );

//     const { success } = res.data;

//     logger.info("Email token verification successful", {
//       action: "verify_email_token_success",
//       metadata: { success },
//     });

//     await setVerifiedCookie();
//     await cleanupVerificationCookies();

//     // Revalidate cache after successful verification
//     revalidatePath(authRoutes.LOGIN);

//     return {
//       success: true,
//       verified: true,
//       redirectUrl: authRoutes.LOGIN,
//     };
//   } catch (error) {
//     if (error instanceof ZodError) {
//       return handleAuthValidationError(error, "verify_email_token");
//     }

//     return handleAuthApiError(error, {
//       actionName: "verify_email_token",
//       statusHandlers: {
//         400: {
//           action: "invalid_format",
//           message: "Invalid token format",
//         },
//         401: {
//           action: "invalid",
//           message: "Invalid or expired token",
//         },
//         404: {
//           action: "not_found",
//           message: "Token not found",
//         },
//       },
//     });
//   }
// }

//* helpers
async function setVerifiedCookie(): Promise<void> {
  const cookieStore = await cookies();
  const isProduction = process.env.NODE_ENV === "production";

  cookieStore.set(AUTH_COOKIE_CONFIG.VERIFIED_COOKIE_NAME, "true", {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict",
    maxAge: 300,
    path: "/",
  });
}
async function cleanupVerificationCookies(): Promise<void> {
  const cookieStore = await cookies();
  const isProduction = process.env.NODE_ENV === "production";

  // Delete verification session cookie from registration
  cookieStore.delete(AUTH_COOKIE_CONFIG.VERIFICATION_COOKIE_NAME);

  // Delete any pending verification cookies
  cookieStore.delete("pendingVerification");
  if (isProduction) {
    cookieStore.delete("__Host-pendingVerification");
  }
}
