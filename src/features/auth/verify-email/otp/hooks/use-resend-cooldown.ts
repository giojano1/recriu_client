import { useResendOtp } from "./use-resend-otp";
import { AUTH_COOKIE_CONFIG } from "@/features/auth/shared/utils/auth.config";
import { saveCooldownData } from "../utils/cooldown.utils";

interface UseResendOtpWithCooldownParams {
  email: string;
  setCooldown: (value: number) => void;
}

export function useResendOtpWithCooldown({
  email,
  setCooldown,
}: UseResendOtpWithCooldownParams) {
  const { mutate: resendOtp, isPending: isResending } = useResendOtp();

  const handleResend = () => {
    resendOtp(email, {
      onSuccess: (data) => {
        if (data.success && saveCooldownData(email)) {
          setCooldown(AUTH_COOKIE_CONFIG.RESEND_COOLDOWN);
        }
      },
    });
  };

  return { handleResend, isResending };
}
