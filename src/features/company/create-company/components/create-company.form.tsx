"use client";

import FormInput from "@/components/ui/inputs/form-input";

export default function CreateCompanyForm() {
  return (
    <section className="w-[750px]  h-full ">
      <div className="w-full h-full bg-muted rounded-2xl p-6">
        <div className="w-full h-full rounded-[10px] bg-background p-6 flex flex-col gap-6 ">
          <section className="flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-bold">Company Details</h2>
            </div>
            <FormInput label="Name" placeholder="e.g Recriu" name="name" />
            <FormInput
              label="Slug"
              placeholder="your-company"
              name="slug"
              className="pl-[86.5px]"
              LeftComponent={
                <p className="text-sm text-muted-foreground ">recriu.com/</p>
              }
            />
            <FormInput
              label="Website Url"
              placeholder="e.g https://www.recriu.com"
              name="websiteUrl"
            />
          </section>
          <section className="flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-bold">Company Size</h2>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
