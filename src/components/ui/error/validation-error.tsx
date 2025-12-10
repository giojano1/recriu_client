import { motion } from "framer-motion";
import { CircleAlert } from "lucide-react";

export default function ValidationError({
  errorMessage,
}: {
  errorMessage: string;
}) {
  return (
    <motion.span
      className="text-error-base absolute top-full mt-[2.5px] flex w-full items-center gap-1 "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <CircleAlert width={12} height={12} />
      <span className="truncate text-[12px] flex-1 ">{errorMessage}</span>
    </motion.span>
  );
}
