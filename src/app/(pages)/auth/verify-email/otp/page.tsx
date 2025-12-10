import { VerifyEmailByOtpForm } from "@/features/auth/verify-email/otp";
import AuthPageWrapper from "@/features/auth/shared/components/page-wrapper";
import { Metadata } from "next";
import { validateVerificationCookie } from "@/features/auth/verify-email/otp/utils/erification-cookie.utils";
import { authRoutes } from "@/constants/routes";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Verify Your Email | Recriu",
  description:
    "Verify your email address to activate your Recriu account. Enter the OTP sent to your inbox and continue setting up your recruitment workspace.",
  keywords: [
    "Recriu verify email",
    "email verification",
    "OTP verification",
    "account verification",
    "recruitment platform",
    "ATS",
    "secure login",
    "verify account",
  ],
  openGraph: {
    title: "Verify Your Email | Recriu",
    description:
      "Enter the OTP sent to your email to complete your Recriu account verification and start improving your hiring workflow.",
    type: "website",
  },
};

export default async function VerifyEmailByOtpPage() {
  const result = await validateVerificationCookie();
  if (!result.success) {
    const redirectMap = {
      already_verified: authRoutes.LOGIN,
      missing_cookie: authRoutes.REGISTER,
      invalid_format: authRoutes.REGISTER,
    };
    redirect(redirectMap[result.reason]);
  }
  return (
    <AuthPageWrapper>
      <AuthPageWrapper.Header title="Verify your email" />
      <VerifyEmailByOtpForm email={result.data.email} />
    </AuthPageWrapper>
  );
}
