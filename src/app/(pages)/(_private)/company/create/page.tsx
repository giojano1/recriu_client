import CreateCompanyForm from "@/features/company/create-company/create-company.form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Company | Recriu",
  description:
    "Create your company profile in Recriu to set up your ATS workspace. Add essential company details and start managing candidates, jobs, and recruitment workflows.",
  keywords: [
    "Recriu create company",
    "company setup",
    "ATS onboarding",
    "create organization",
    "recruitment workspace setup",
    "HR software",
    "ATS platform",
    "company profile creation",
  ],
  openGraph: {
    title: "Create Company | Recriu",
    description:
      "Set up your company in Recriu to unlock powerful recruitment and workflow management tools. Complete your onboarding in minutes.",
    type: "website",
  },
};

export default async function page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-[500px]">
        <CreateCompanyForm />
      </div>
    </div>
  );
}
