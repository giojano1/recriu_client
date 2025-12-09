export const authRoutes = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  VERIFY_EMAIL: "/auth/verify-email",
  VERIFY_EMAIL_OTP: "/auth/verify-email/otp",
  RESET_PASSWORD: "/auth/reset-password",
  FORGOT_PASSWORD: "/auth/forgot-password",
} as const;

export const dashboardRoutes = {
  DASHBOARD: "/dashboard",
};

export const companyRoutes = {
  CREATE: "/company/create",
} as const;
