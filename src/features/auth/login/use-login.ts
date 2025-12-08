import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/api/api-error";
import { loginAction } from "./login.action";
import { LoginActionResult } from "../types";

export const useLogin = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: loginAction,
    retry: false,
    onSuccess: (data: LoginActionResult) => {
      if (data.success) {
        toast.success("Login successful!");
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
