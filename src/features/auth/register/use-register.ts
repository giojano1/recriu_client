import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { registerAction } from "./register.action";
import { RegisterActionResult } from "../shared/types";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/api/api-error";

export const useRegister = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: registerAction,
    retry: false,
    onSuccess: (data: RegisterActionResult) => {
      if (data.success) {
        toast.success(
          "Registration successful! Check your email to verify your account."
        );
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
