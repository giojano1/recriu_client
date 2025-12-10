"use client";

import OtpInput from "@/components/ui/inputs/otp-input";
import { useTypedForm } from "@/hooks/use-typed-form";
import { useEffect } from "react";
import { Controller } from "react-hook-form";
import FormWrapper from "@/components/ui/wrapper/form-wrapper";
import verifyEmailOtpSchema from "./schemas/verify-email-otp.schema";
import { getInitialCooldown } from "./utils/cooldown.utils";
import { ResendButton } from "./ui/resend-button";
import {
  useCooldownTimer,
  useResendOtpWithCooldown,
  useVerifyEmailOtp,
} from "./hooks";

export function VerifyEmailByOtpForm({ email }: { email: string }) {
  // React hook form methods
  const formMethods = useTypedForm(verifyEmailOtpSchema, {
    defaultValues: {
      email: email || "",
      otp: "",
    },
  });
  const { control, setValue } = formMethods;
  const { mutate: verifyEmail, isPending } = useVerifyEmailOtp();

  const { cooldown, setCooldown } = useCooldownTimer(getInitialCooldown(email));
  const { handleResend, isResending } = useResendOtpWithCooldown({
    email,
    setCooldown,
  });

  // Set email field when email prop changes
  useEffect(() => {
    if (email) {
      setValue("email", email, { shouldValidate: true });
    }
  }, [email, setValue]);

  const canResend = email && cooldown === 0 && !isResending;

  return (
    <FormWrapper
      formMethods={formMethods}
      onSubmit={verifyEmail}
      isPending={isPending}
      ariaLabel={"Verify email form"}
      submitButtonLabel={"Verify"}
      submitButtonLoadingLabel={"Verifying..."}
    >
      {/* Title */}
      <div className="max-400:text-[14px] text-center text-[16px] font-light">
        <span className="text-default block text-nowrap">
          We have sent a verification code to
        </span>
        <span className="text-greyscale-900 font-medium dark:text-white">
          {email}
        </span>
      </div>

      {/* OTP Input */}
      <div className="relative mx-auto">
        <Controller
          name="otp"
          control={control}
          render={({ field }) => (
            <OtpInput
              value={field.value || ""}
              onChange={field.onChange}
              isPending={isPending}
            />
          )}
        />
        {formMethods.formState.errors.otp && (
          <OtpInput.Error message={formMethods.formState.errors.otp.message} />
        )}
      </div>
      {/* Resend button */}
      <ResendButton
        onResend={canResend ? handleResend : () => {}}
        cooldown={cooldown}
        isResending={isResending}
      />
    </FormWrapper>
  );
}
