import { useMounted } from "@/hooks/use-mounted";

export function ResendButton({
  onResend,
  cooldown,
  isResending,
}: {
  onResend: () => void;
  cooldown: number;
  isResending: boolean;
}) {
  const mounted = useMounted();

  // Use static initial state during SSR to avoid hydration mismatch
  const displayCooldown = mounted ? cooldown : 0;
  const displayIsResending = mounted ? isResending : false;

  const isDisabled = displayCooldown > 0 || displayIsResending;

  const getButtonText = () => {
    if (displayIsResending) return "Resending...";
    if (displayCooldown > 0) return `Resend code in ${displayCooldown}s`;
    return "Resend verification code";
  };

  return (
    <div className="text-center">
      <button
        type="button"
        onClick={onResend}
        disabled={isDisabled}
        className="text-default cursor-pointer text-sm font-medium underline transition-colors disabled:cursor-not-allowed disabled:opacity-50"
      >
        {getButtonText()}
      </button>
    </div>
  );
}
