export const AUTH_COOKIE_CONFIG = {
  ACCESS_TOKEN_MAX_AGE: 60 * 30, // 30 minute
  REFRESH_TOKEN_MAX_AGE: 60 * 60 * 24 * 30, // 30 days

  SELECTED_COMPANY_MAX_AGE: 60 * 60 * 24 * 30,
  TEMP_TOKEN_MAX_AGE: 60 * 5,
  VERIFICATION_COOKIE_NAME:
    process.env.NODE_ENV === "production"
      ? "__Host-pendingVerification"
      : "pendingVerification",

  VERIFICATION_EXPIRY: 15 * 60,

  VERIFIED_COOKIE_NAME:
    process.env.NODE_ENV === "production"
      ? "__Host-emailVerified"
      : "emailVerified",

  RESEND_COOLDOWN: 60,
  COOLDOWN_STORAGE_KEY: "verify_email_resend_cooldown",
  VERIFIED_EXPIRY: 300,

  SESSION_COOKIE_NAME: "next-auth.session-token",
  CALLBACK_URL_COOKIE_NAME: "next-auth.callback-url",
} as const;
