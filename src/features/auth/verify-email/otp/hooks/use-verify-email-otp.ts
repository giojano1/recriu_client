import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { verifyEmailOtpAction } from "../../verify-email.action";
import { VerifyEmailActionResult } from "@/features/auth/shared/types";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/api/api-error";

export const useVerifyEmailOtp = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: verifyEmailOtpAction,
    retry: false,
    onSuccess: (data: VerifyEmailActionResult) => {
      if (data.success) {
        toast.success("Email verified successfully!");
        if (data.redirectUrl) {
          router.push(data.redirectUrl);
        }
      } else {
        if (data.error) {
          toast.error(data.error);
        }
      }
    },
    onError: (error: unknown) => {
      const message = getErrorMessage(error);
      toast.error(message || "Something went wrong. Please try again.");
    },
  });
};
