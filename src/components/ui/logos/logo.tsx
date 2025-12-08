"use client";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils/utils";
import { useTheme } from "next-themes";
import Image from "next/image";

const sizeConfig = {
  lg: {
    container: "size-12 rounded-[12px]",
    gradient: "rounded-[12px] p-0.5",
    inner: "rounded-[11px]",
    image: 26,
  },
  sm: {
    container: "size-8 rounded-lg",
    gradient: "rounded-lg p-px",
    inner: "rounded-[7px]",
    image: 20,
  },
} as const;

export default function Logo({ size = "lg" }: { size?: "lg" | "sm" }) {
  const { resolvedTheme } = useTheme();
  const mounted = useMounted();

  const config = sizeConfig[size];

  const logoSrc =
    mounted && resolvedTheme === "dark"
      ? "/assets/svg/logo_black.svg"
      : "/assets/svg/logo_white.svg";

  return (
    <div
      className={cn(
        "relative flex items-center justify-center bg-grey-900 dark:bg-grey-300",
        config.container
      )}
    >
      {/* Gradient overlay */}
      <div
        className={cn(
          "absolute inset-0 bg-linear-to-b from-white/20 to-white/5",
          config.gradient
        )}
      >
        <div
          className={cn(
            "h-full w-full bg-grey-900 dark:bg-grey-300",
            config.inner
          )}
        />
      </div>

      {/* Logo */}
      <div className="relative z-10">
        <Image
          src={logoSrc}
          width={config.image}
          height={config.image}
          alt="logo"
          priority
        />
      </div>
    </div>
  );
}
