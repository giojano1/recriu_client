"use client";

import { useTypedForm } from "@/hooks/use-typed-form";
import { loginDefaultValues, loginSchema } from "./login.schema";
import { useLogin } from "./use-login";
import FormWrapper from "@/components/ui/wrapper/form-wrapper";
import FormInput from "@/components/ui/inputs/form-input";
import PasswordInput from "@/components/ui/inputs/password-input";
import { authRoutes } from "@/constants/routes";
import Link from "next/link";

export default function LoginForm() {
  const formMethods = useTypedForm(loginSchema, {
    defaultValues: loginDefaultValues,
  });
  const { register } = formMethods;
  const { mutate: login, isPending } = useLogin();
  return (
    <FormWrapper
      formMethods={formMethods}
      onSubmit={login}
      isPending={isPending}
      ariaLabel="Login form"
      submitButtonLabel={"Continue"}
      submitButtonLoadingLabel={"Loading..."}
    >
      <FormInput
        label={"Email"}
        placeholder={"your@email.com"}
        name="email"
        register={register}
        errors={formMethods.formState.errors}
        disabled={isPending}
      />
      <PasswordInput
        label={"Password"}
        name="password"
        register={register}
        errors={formMethods.formState.errors}
        disabled={isPending}
      />
      <div className="-mb-3 flex flex-wrap items-center justify-end">
        <Link
          href={authRoutes.FORGOT_PASSWORD}
          className="text-tertiary text-[13px] font-medium whitespace-nowrap"
        >
          Forgot your password?
        </Link>
      </div>
    </FormWrapper>
  );
}
