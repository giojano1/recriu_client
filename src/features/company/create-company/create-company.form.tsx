"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FormInput from "@/components/ui/inputs/form-input";
import Selector from "@/components/ui/inputs/selector";
import FormWrapper from "@/components/ui/wrapper/form-wrapper";
import { useTypedForm } from "@/hooks/use-typed-form";
import { CompanySize } from "../shared/types";
import {
  createCompanyDefaultValues,
  createCompanySchema,
} from "./create-company.schema";
import { useCreateCompany } from "./use-create-company";
const companySizeList = [
  {
    value: CompanySize.STARTUP_1_10,
    label: "1-10",
  },
  {
    value: CompanySize.SMALL_11_50,
    label: "11-50",
  },
  {
    value: CompanySize.MEDIUM_51_200,
    label: "51-200",
  },
  {
    value: CompanySize.LARGE_201_1000,
    label: "201-1000",
  },
  {
    value: CompanySize.ENTERPRISE_1000_PLUS,
    label: "1000+",
  },
];
export default function CreateCompanyForm() {
  const formMethods = useTypedForm(createCompanySchema, {
    defaultValues: createCompanyDefaultValues,
  });
  const { register } = formMethods;
  const { mutate, isPending } = useCreateCompany();
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Set up your company</CardTitle>
        <CardDescription>
          Create your company profile to get started with Recriu
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormWrapper
          formMethods={formMethods}
          onSubmit={mutate}
          isPending={isPending}
          ariaLabel="Create Company Form"
          submitButtonLabel="Create"
          submitButtonLoadingLabel="Creating..."
        >
          <FormInput
            label="Name"
            placeholder="e.g Recriu"
            name="name"
            register={register}
            errors={formMethods.formState.errors}
            disabled={isPending}
            required={true}
          />
          <FormInput
            label="Slug"
            placeholder="your-company"
            name="slug"
            className="pl-[86.5px]"
            register={register}
            errors={formMethods.formState.errors}
            disabled={isPending}
            required={true}
            LeftComponent={
              <p className="text-muted-foreground text-sm">recriu.com/</p>
            }
          />
          <FormInput
            label="Website Url"
            placeholder="e.g https://www.recriu.com"
            name="website"
            register={register}
            errors={formMethods.formState.errors}
            disabled={isPending}
          />
          <Selector
            label="Company Size"
            placeholder="Select company size"
            name="size"
            control={formMethods.control}
            errors={formMethods.formState.errors}
            disabled={isPending}
            list={companySizeList}
            required={true}
          />
        </FormWrapper>
      </CardContent>
    </Card>
  );
}
