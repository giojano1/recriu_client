import { Button } from "../button";
import { FormWrapperProps } from "@/types/component.types";
import { FieldValues } from "react-hook-form";

export default function FormWrapper<T extends FieldValues>({
  onSubmit,
  formMethods,
  isPending = false,
  ariaLabel,
  submitButtonLabel,
  submitButtonLoadingLabel,
  children,
  secondaryBtn,
}: FormWrapperProps<T>) {
  const { handleSubmit, formState } = formMethods;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label={ariaLabel}
      suppressHydrationWarning
    >
      <fieldset disabled={isPending}>
        <div className="mb-8 flex flex-col gap-6">{children}</div>

        <Button
          className="w-full"
          disabled={!formState.isValid || isPending}
          type="submit"
        >
          {isPending ? submitButtonLoadingLabel : submitButtonLabel}
        </Button>

        {secondaryBtn && (
          <>
            <div className="my-4 flex items-center justify-between gap-2">
              <div className="bg-border h-px w-full flex-1" />
              <span className="text-muted-foreground block text-[14px]">
                Or
              </span>
              <div className="bg-border h-px w-full flex-1" />
            </div>
            {secondaryBtn}
          </>
        )}
      </fieldset>
    </form>
  );
}
