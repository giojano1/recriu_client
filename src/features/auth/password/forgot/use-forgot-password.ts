import { useMutation } from "@tanstack/react-query";
import { forgotPasswordAction } from "./forgot-password.action";
import { ForgotPasswordActionResult } from "../../shared/types";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/api/api-error";

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPasswordAction,
    retry: false,
    onSuccess: (data: ForgotPasswordActionResult) => {
      if (data.success) {
        toast.success(
          "If an account with that email exists, a password reset link has been sent."
        );
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
