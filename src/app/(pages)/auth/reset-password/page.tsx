import AuthPageWrapper from "@/features/auth/shared/components/page-wrapper";
import ResetPasswordForm from "@/features/auth/password/reset/reset-password-form";
import { authRoutes } from "@/constants/routes";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Reset Your Password | Recriu",
  description:
    "Create a new password to securely regain access to your Recriu account. Enter and confirm your new password to complete the reset process.",
  keywords: [
    "Recriu reset password",
    "new password",
    "password reset form",
    "update password",
    "ATS password reset",
    "recruitment platform security",
    "change account password",
  ],
  openGraph: {
    title: "Recriu | Reset Password",
    description:
      "Enter your new password to securely complete your Recriu password reset and regain access to your account.",
    type: "website",
  },
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  if (!token) redirect(authRoutes.REGISTER);
  return (
    <AuthPageWrapper>
      <AuthPageWrapper.Header
        title="Welcome back"
        subtitle="Enter your credentials to access your account."
      />
      <ResetPasswordForm token={token} />
      <AuthPageWrapper.Footer
        text="Or"
        linkText="Sign In"
        linkHref={authRoutes.LOGIN}
      />
    </AuthPageWrapper>
  );
}
