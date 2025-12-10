import { authRoutes } from "@/constants/routes";
import AuthPageWrapper from "@/features/auth/shared/components/page-wrapper";
import LoginForm from "@/features/auth/login/login.form";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login to Your Account | Recriu",
  description:
    "Access your Recriu account to manage candidates, track applications, and streamline your hiring workflow. Log in to continue using our powerful recruitment tools.",
  keywords: [
    "Recriu login",
    "sign in",
    "ATS login",
    "hiring platform login",
    "recruitment software",
    "candidate tracking",
    "talent acquisition tools",
  ],
  openGraph: {
    title: "Recriu Login",
    description:
      "Sign in to your Recriu account and continue hiring smarter with our advanced Applicant Tracking System.",
    type: "website",
  },
};
export default function LoginPage() {
  return (
    <AuthPageWrapper>
      <AuthPageWrapper.Header
        title="Welcome back"
        subtitle="Enter your credentials to access your account."
      />
      <LoginForm />
      <AuthPageWrapper.Footer
        text={"Don't have an account?"}
        linkText={"Create one"}
        linkHref={authRoutes.REGISTER}
      />
    </AuthPageWrapper>
  );
}
