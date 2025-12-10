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
    <div className="mx-auto flex h-svh max-w-[1440px] items-center justify-center gap-4 px-4 py-6 md:p-10">
      <div className="max-1200:gap-4 flex h-full w-full justify-between gap-6">
        <CreateCompanyPageTitle />
        <CreateCompanyForm />
      </div>
    </div>
  );
}
