import CreateCompanyForm from "@/features/company/create-company/components/create-company.form";
import CreateCompanyPageTitle from "@/features/company/create-company/components/page-title";
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
    <div className="h-svh max-w-[1440px] mx-auto flex items-center justify-center p-8">
      <div className="flex justify-between w-full gap-8 h-full">
        <CreateCompanyPageTitle />
        <CreateCompanyForm />
      </div>
    </div>
  );
}
