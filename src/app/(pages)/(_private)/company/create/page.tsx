import CreateCompanyForm from "@/features/company/create-company/components/create-company.form";
import CreateCompanyHeader from "@/features/company/create-company/components/header";
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
    <div className="flex h-svh flex-col">
      <CreateCompanyHeader />
      <div className="max-1100:gap-8 max-950:flex-col mx-auto flex h-full max-h-[700px] min-h-0 w-full max-w-[1240px] flex-1 justify-between gap-12 px-4 py-6 md:p-10">
        <CreateCompanyPageTitle />
        <CreateCompanyForm />
      </div>
    </div>
  );
}
