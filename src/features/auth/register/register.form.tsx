"use client";
import { useTypedForm } from "@/hooks/use-typed-form";
import { registerDefaultValues, registerSchema } from "./register.schema";
import FormWrapper from "@/components/ui/wrapper/form-wrapper";
import { useRegister } from "./use-register";
import FormInput from "@/components/ui/inputs/form-input";
import PasswordInput from "@/components/ui/inputs/password-input";

export default function RegisterForm() {
  const formMethods = useTypedForm(registerSchema, {
    defaultValues: registerDefaultValues,
  });
  const { register } = formMethods;
  const { mutate: registerUser, isPending } = useRegister();

  return (
    <FormWrapper
      formMethods={formMethods}
      onSubmit={registerUser}
      isPending={isPending}
      ariaLabel="Register Form"
      submitButtonLabel="Create Account"
      submitButtonLoadingLabel="Creating..."
    >
      <FormInput
        label="First Name"
        placeholder="John"
        name="firstName"
        register={register}
        errors={formMethods.formState.errors}
        disabled={isPending}
      />
      <FormInput
        label="Last Name"
        placeholder="Doe"
        name="lastName"
        register={register}
        errors={formMethods.formState.errors}
        disabled={isPending}
      />
      <FormInput
        label="Email"
        placeholder="example@company.com"
        name="email"
        register={register}
        errors={formMethods.formState.errors}
        disabled={isPending}
      />

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
