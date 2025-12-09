type EyeBtnProps = {
  isPasswordVisible: boolean;
  onClick: () => void;
};
const pathVariants = {
  hidden: { opacity: 1, pathLength: 1 },
  visible: { opacity: 0, pathLength: 0 },
};
import { motion } from "framer-motion";
export default function Eye({ isPasswordVisible, onClick }: EyeBtnProps) {
  return (
    <motion.button
      className="flex h-fit w-fit cursor-pointer border-none bg-transparent"
      title="toggle password visibility"
      type="button"
      onClick={onClick}
      initial={"hidden"}
      animate={isPasswordVisible ? "visible" : "hidden"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={16}
        height={16}
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-[#757575] dark:stroke-white"
      >
        <mask id="myMask">
          <rect x="0" y="0" width="24" height="24" fill="white" stroke="none" />

          <motion.path
            d="M 0 0 L 24 24"
            className="stroke-greyscale-900 dark:stroke-white"
            variants={pathVariants}
          />
        </mask>
        <path
          d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
          mask="url(#myMask)"
        />
        <circle cx={12} cy={12} r={3} mask="url(#myMask)" />
        <motion.path
          d="M 2 4 L 20 22"
          className="stroke-[#757575] dark:stroke-white"
          variants={pathVariants}
        />
      </svg>
    </motion.button>
  );
}
