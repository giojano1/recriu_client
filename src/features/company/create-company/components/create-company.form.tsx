"use client";

import FormInput from "@/components/ui/inputs/form-input";
import SizeSelector from "./size-selector";
import { Button } from "@/components/ui/button";

export default function CreateCompanyForm() {
  return (
    <section className="max-1300:w-[650px] max-1200:w-[550px] max-1000:p-3 max-1000:w-full bg-muted max-1000:bg-transparent h-full w-[750px] rounded-2xl p-6">
      <div className="bg-background max-1000:p-4 flex h-full w-full flex-col gap-6 rounded-[10px] md:border md:p-6">
        {/* form */}
        <div className="flex h-full flex-col gap-8 overflow-y-auto">
          <SectionBlock title="Company Details">
            <FormInput label="Name" placeholder="e.g Recriu" name="name" />
            <FormInput
              label="Slug"
              placeholder="your-company"
              name="slug"
              className="pl-[86.5px]"
              LeftComponent={
                <p className="text-muted-foreground text-sm">recriu.com/</p>
              }
            />
            <FormInput
              label="Website Url"
              placeholder="e.g https://www.recriu.com"
              name="websiteUrl"
            />
          </SectionBlock>
          <SectionBlock title="Company Size">
            <SizeSelector />
          </SectionBlock>
        </div>
        {/* action button */}
        <div className="flex flex-1 justify-end">
          <Button>Create Company</Button>
        </div>
      </div>
    </section>
  );
}
function SectionBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-bold">{title}</h2>
      {children}
    </div>
  );
}
