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
  CANDIDATES: "/dashboard/candidates",
  JOBS: "/dashboard/jobs",
  SETTINGS: "/dashboard/settings",
  ANALYTICS: "/dashboard/analytics",
  CALENDAR: "/dashboard/calendar",
  CAREER_PAGE: "/dashboard/career-page",
  TEAM: "/dashboard/team",
};

export const companyRoutes = {
  CREATE: "/company/create",
} as const;
