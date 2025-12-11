import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/api/api-error";
import { logger } from "@/lib/utils/logger";
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

        try {
          // Update session with new companyId
          await update({
            companyId: data.companyId,
          });

          // Small delay to ensure session propagation across server/client boundary
          // This allows the session cookie to be set before navigation
          await new Promise((resolve) => setTimeout(resolve, 100));

          logger.info("Session updated with new companyId, navigating", {
            action: "company_creation_navigation",
            metadata: {
              companyId: data.companyId,
              redirectUrl: data.redirectUrl,
            },
          });

          if (data.redirectUrl) {
            router.push(data.redirectUrl);
          }
        } catch (error) {
          logger.error("Failed to update session after company creation", {
            action: "company_creation_session_update_failed",
            error: error instanceof Error ? error.message : "Unknown error",
          });

          toast.error(
            "Company created but session update failed. Please refresh the page."
          );
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
