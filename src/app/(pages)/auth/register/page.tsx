import { authRoutes } from "@/constants/routes";
import RegisterForm from "@/features/auth/register/register.form";
import AuthPageWrapper from "@/features/auth/shared/components/page-wrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Your Account | Recriu",
  description:
    "Join Recriu and create your account to streamline your hiring workflow. Register to access powerful recruitment tools designed to help you find and hire top talent faster.",
  keywords: [
    "Recriu register",
    "signup",
    "create account",
    "recruitment platform",
    "ATS",
    "hiring software",
    "talent acquisition",
  ],
  openGraph: {
    title: "Create Your Recriu Account",
    description:
      "Sign up for Recriu and start hiring smarter with our advanced Applicant Tracking System.",
    type: "website",
  },
};
export default function RegisterPage() {
  return (
    <AuthPageWrapper>
      <AuthPageWrapper.Header
        title="Create your account"
        subtitle="Fill in the form below to create your account."
      />
      <RegisterForm />
      <AuthPageWrapper.Footer
        text="Already have an account?"
        linkText="Sign In"
        linkHref={authRoutes.LOGIN}
      />
    </AuthPageWrapper>
  );
}
