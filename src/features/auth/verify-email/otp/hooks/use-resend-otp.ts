import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { getErrorMessage } from "@/lib/api/api-error";
import { resendOtpAction } from "../../verify-email.action";
export const useResendOtp = () => {
  return useMutation({
    mutationFn: resendOtpAction,
    retry: false,
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Verification code sent! Check your email.");
      } else {
        toast.error(data.error || "Failed to resend code. Please try again.");
      }
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};
