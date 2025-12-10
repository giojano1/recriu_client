"use client";
import { Button } from "@/components/ui/button";
import { useVerifyEmailToken } from "./use-verify-email-token";

export default function VerfiyEmailForm({ token }: { token?: string }) {
  const { mutate, isPending } = useVerifyEmailToken();
  if (!token) {
    return (
      <div className="text-center">
        <p className="text-destructive">
          Invalid verification link. Please check your email for the correct
          link.
        </p>
      </div>
    );
  }
  return (
    <Button
      className="w-full"
      onClick={() => mutate(token)}
      disabled={isPending}
    >
      {isPending ? "Verifying..." : "Verify Email"}
    </Button>
  );
}
