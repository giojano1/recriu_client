import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { motion } from "framer-motion";
import { CircleAlert } from "lucide-react";

export default function OtpInput({
  value,
  onChange,
  isPending,
}: {
  value: string;
  onChange: (value: string) => void;
  isPending: boolean;
}) {
  return (
    <InputOTP
      maxLength={6}
      pattern="\d*"
      autoFocus
      inputMode="numeric"
      value={value}
      onChange={onChange}
      disabled={isPending}
    >
      <InputOTPGroup>
        <InputOTPSlot index={0} className="size-10" />
        <InputOTPSlot index={1} className="size-10" />
        <InputOTPSlot index={2} className="size-10" />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} className="size-10" />
        <InputOTPSlot index={4} className="size-10" />
        <InputOTPSlot index={5} className="size-10" />
      </InputOTPGroup>
    </InputOTP>
  );
}
OtpInput.Error = function Error({ message }: { message?: string }) {
  return (
    <motion.span
      className="text-error-base absolute top-full mt-[2.5px] flex max-h-6 w-full items-center gap-1 overflow-hidden text-[11px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <CircleAlert width={11} height={11} />
      {message}
    </motion.span>
  );
};
