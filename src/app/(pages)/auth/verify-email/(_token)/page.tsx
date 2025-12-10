import AuthPageWrapper from "@/features/auth/shared/components/page-wrapper";
import VerfiyEmailForm from "@/features/auth/verify-email/token/verify-email-form";
import { authRoutes } from "@/constants/routes";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Email Verification | Recriu",
  description:
    "Verify your Recriu account using your secure email verification token. Complete your account activation and access powerful recruitment tools.",
  keywords: [
    "Recriu email token verification",
    "email verification link",
    "account activation",
    "verify token",
    "secure verification",
    "ATS platform",
    "recruitment software",
    "Recriu account setup",
  ],
  openGraph: {
    title: "Email Verification | Recriu",
    description:
      "Use your email verification token to securely activate your Recriu account and start optimizing your hiring workflow.",
    type: "website",
  },
};
export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  if (!token) redirect(authRoutes.REGISTER);
  return (
    <AuthPageWrapper>
      <AuthPageWrapper.Header
        title="Verify your email address"
        subtitle="Please click the button below to verify your email"
      />
      <VerfiyEmailForm token={token} />
    </AuthPageWrapper>
  );
}
