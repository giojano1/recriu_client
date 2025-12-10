"use client";
import FormInput from "@/components/ui/inputs/form-input";
import FormWrapper from "@/components/ui/wrapper/form-wrapper";
import forgotPasswordSchema, {
  forgotPasswordDefaultValues,
} from "./forgot-password.schema";
import { useTypedForm } from "@/hooks/use-typed-form";
import { useForgotPassword } from "./use-forgot-password";

export default function ForgotPasswordForm() {
  const formMethods = useTypedForm(forgotPasswordSchema, {
    defaultValues: forgotPasswordDefaultValues,
  });
  const { register } = formMethods;
  const { mutate: forgotPassword, isPending } = useForgotPassword();

  return (
    <FormWrapper
      formMethods={formMethods}
      onSubmit={forgotPassword}
      isPending={isPending}
      ariaLabel={"Forgot Password form"}
      submitButtonLabel={"Send Reset Link"}
      submitButtonLoadingLabel={"Sending..."}
    >
      <FormInput
        label="Email"
        placeholder="example@company.com"
        name="email"
        register={register}
        errors={formMethods.formState.errors}
        disabled={isPending}
      />
    </FormWrapper>
  );
}
