"use client";

import FormInput from "@/components/ui/inputs/form-input";
import SizeSelector from "./size-selector";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function CreateCompanyForm() {
  return (
    <section className="border-muted flex h-full w-full flex-col gap-4 rounded-2xl border-16 px-5 py-6">
      {/* form */}
      <div className="flex h-full flex-1 flex-col gap-8 overflow-y-auto px-1">
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
      <div className="flex justify-end px-1">
        <Button>Create Company</Button>
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
