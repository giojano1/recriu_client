import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { motion } from "framer-motion";
import { CircleAlert } from "lucide-react";
import ValidationError from "../error/validation-error";

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
OtpInput.Error = function Error({ message }: { message: string }) {
  return <ValidationError errorMessage={message} />;
};
