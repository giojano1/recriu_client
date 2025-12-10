import AuthPageWrapper from "@/features/auth/shared/components/page-wrapper";
import ForgotPasswordForm from "@/features/auth/password/forgot/forgot-password-form";
import { authRoutes } from "@/constants/routes";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | Recriu",
  description:
    "Trouble signing in? Recover your Recriu account by requesting a password reset link. Enter your email to receive instructions.",
  keywords: [
    "Recriu forgot password",
    "password help",
    "account recovery",
    "forgot login",
    "ATS password help",
    "recruitment platform account recovery",
    "send reset link",
  ],
  openGraph: {
    title: "Recriu | Forgot Password",
    description:
      "Forgot your password? Request a secure password reset link to regain access to your Recriu account.",
    type: "website",
  },
};

export default function ForgotPasswordPage() {
  return (
    <AuthPageWrapper>
      <AuthPageWrapper.Header
        title="Forgot Password"
        subtitle="Enter the email address associated with your account 
and we'll send you a link to reset your password."
      />
      <ForgotPasswordForm />
      <AuthPageWrapper.Footer
        text="Or"
        linkText="Sign In"
        linkHref={authRoutes.LOGIN}
      />
    </AuthPageWrapper>
  );
}
