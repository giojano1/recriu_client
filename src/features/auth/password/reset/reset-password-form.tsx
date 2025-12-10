"use client";
import { useTypedForm } from "@/hooks/use-typed-form";
import resetPasswordSchema, {
  resetPasswordDefaultValues,
  ResetPasswordFormType,
} from "./reset-password.schema";
import FormWrapper from "@/components/ui/wrapper/form-wrapper";
import PasswordInput from "@/components/ui/inputs/password-input";
import { useResetPassword } from "./use-reset-password";
import { toast } from "sonner";

export default function ResetPasswordForm({ token }: { token?: string }) {
  const formMethods = useTypedForm(resetPasswordSchema, {
    defaultValues: resetPasswordDefaultValues,
  });
  const { register } = formMethods;
  const { mutate, isPending } = useResetPassword();
  const handleSubmit = (data: ResetPasswordFormType) => {
    if (!token) {
      toast.error("Invalid reset link. Please request a new password reset.");
      return;
    }
    mutate({ token, data });
  };
  if (!token) {
    return (
      <div className="text-center">
        <p className="text-destructive">
          Invalid password reset link. Please check your email for the correct
          link.
        </p>
      </div>
    );
  }
  return (
    <FormWrapper
      formMethods={formMethods}
      onSubmit={handleSubmit}
      isPending={isPending}
      ariaLabel={"Reset Password form"}
      submitButtonLabel={"Reset Password"}
      submitButtonLoadingLabel={"Resetting..."}
    >
      <PasswordInput
        label="Password"
        name="password"
        register={register}
        errors={formMethods.formState.errors}
        disabled={isPending}
      />

      <PasswordInput
        label="Confirm Password"
        name="confirmPassword"
        register={register}
        errors={formMethods.formState.errors}
        disabled={isPending}
      />
    </FormWrapper>
  );
}
