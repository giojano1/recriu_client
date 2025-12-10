import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/api/api-error";
import { resetPasswordAction } from "./reset-password.action";
import { ResetPasswordActionResult } from "../../shared/types";
import { ResetPasswordFormType } from "./reset-password.schema";

export const useResetPassword = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: ({
      token,
      data,
    }: {
      token: string;
      data: ResetPasswordFormType;
    }) => resetPasswordAction(token, data),
    retry: false, // Disable retries for auth operations
    onSuccess: (data: ResetPasswordActionResult) => {
      if (data.success) {
        toast.success("Password reset successfully! You can now log in.");
        // Use redirectUrl from action response
        if (data.redirectUrl) {
          router.push(data.redirectUrl);
        }
      } else {
        // Handle server-side errors
        if (data.error) {
          toast.error(data.error);
        }
      }
    },
    onError: (error: unknown) => {
      // Handle unexpected errors (network issues, exceptions)
      const message = getErrorMessage(error);
      toast.error(message || "Something went wrong. Please try again.");
    },
  });
};
