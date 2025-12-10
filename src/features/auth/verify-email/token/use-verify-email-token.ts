import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/api/api-error";
import { verifyEmailTokenAction } from "../verify-email.action";
import { VerifyEmailTokenActionResult } from "../../shared/types";

export const useVerifyEmailToken = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: verifyEmailTokenAction,
    retry: false,
    onSuccess: (data: VerifyEmailTokenActionResult) => {
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
