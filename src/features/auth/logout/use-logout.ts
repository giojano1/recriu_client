import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/api/api-error";
import { logoutAction } from "./logout.action";
import type { LogoutActionResult } from "../shared/types";

/**
 * Logout Hook
 *
 * Provides a mutation for logging out users with:
 * - Complete cache invalidation (clears all TanStack Query cache)
 * - NextAuth session cleanup (via server action)
 * - Client-side redirect
 * - Loading and error states
 * - Toast notifications
 *
 * Usage:
 * ```tsx
 * const { mutate: logout, isPending } = useLogout();
 *
 * <button onClick={() => logout()} disabled={isPending}>
 *   {isPending ? "Logging out..." : "Log out"}
 * </button>
 * ```
 */
export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutAction,
    retry: false,
    onMutate: async () => {
      // Optimistically clear all queries before logout
      // This ensures no stale data remains in cache
      await queryClient.cancelQueries();
    },
    onSuccess: (data: LogoutActionResult) => {
      if (data.success) {
        // Clear all cached queries
        queryClient.clear();

        // Show success message
        toast.success("Logged out successfully");

        // Redirect to login page
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
      // Handle unexpected errors
      const message = getErrorMessage(error);
      toast.error(message || "Failed to log out. Please try again.");

      // Clear cache anyway to prevent stale data
      queryClient.clear();
    },
  });
};
