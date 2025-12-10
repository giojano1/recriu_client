"use server";
import ServerAPI from "@/lib/api/server-api";
import { RegisterActionResult, RegisterResponse } from "../shared/types";
import { hashEmail } from "@/lib/utils/hash-pii";
import { logger } from "@/lib/utils/logger";
import { cookies } from "next/headers";
import { ZodError } from "zod";
import { RegisterFormType } from "./register.schema";
import { registerSchema } from "./register.schema";
import { AUTH_COOKIE_CONFIG } from "../shared/utils/auth.config";
import { authRoutes } from "@/constants/routes";
import {
  handleAuthCsrf,
  handleAuthValidationError,
  handleAuthApiError,
} from "../shared/utils/error-handlers";
export async function registerAction(
  data: RegisterFormType
): Promise<RegisterActionResult> {
  try {
    //* CSRF Protection: Verify origin matches host
    const csrfError = await handleAuthCsrf("register");
    if (csrfError) return csrfError;

    //* Validate and sanitize input data
    const validatedData = registerSchema.parse(data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...dataToSend } = validatedData;

    logger.info("Register attempt", {
      action: "register_attempt",
      metadata: { emailHash: hashEmail(validatedData.email) },
    });

    const res = await ServerAPI.post<RegisterResponse>(
      "/auth/register",
      dataToSend
    );

    const { email } = res.data.data;

    logger.info("Register successful", {
      action: "register_success",
      metadata: { emailHash: hashEmail(email) },
    });

    await setVerificationCookie(email);

    return {
      success: true,
      userEmail: email,
      redirectUrl: authRoutes.VERIFY_EMAIL_OTP,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return handleAuthValidationError(error, "register");
    }

    return handleAuthApiError(error, {
      actionName: "register",
      statusHandlers: {
        409: {
          action: "duplicate_email",
          message: "Email already in use",
        },
      },
    });
  }
}
async function setVerificationCookie(email: string): Promise<void> {
  const cookieStore = await cookies();
  const isProduction = process.env.NODE_ENV === "production";
  const verificationSessionId = crypto.randomUUID();

  cookieStore.set(
    AUTH_COOKIE_CONFIG.VERIFICATION_COOKIE_NAME,
    JSON.stringify({ sessionId: verificationSessionId, email }),
    {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
      maxAge: AUTH_COOKIE_CONFIG.VERIFICATION_EXPIRY,
      path: "/",
    }
  );
}
