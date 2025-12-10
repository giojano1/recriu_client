import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/api/api-error";
import { createCompanyAction } from "./create-company.action";
import { CreateCompanyActionResult } from "../shared/types";

export const useCreateCompany = () => {
  const router = useRouter();
  const { update } = useSession();

  return useMutation({
    mutationFn: createCompanyAction,
    retry: false,
    onSuccess: async (data: CreateCompanyActionResult) => {
      if (data.success) {
        toast.success("Company created successfully!");

        // Update session with new companyId
        await update({
          companyId: data.companyId,
        });

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
      toast.error(message || "Failed to create company. Please try again.");
    },
  });
};
