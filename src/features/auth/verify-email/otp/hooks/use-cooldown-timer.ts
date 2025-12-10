import { useEffect, useState } from "react";
import { clearCooldownData } from "../utils/cooldown.utils";

export function useCooldownTimer(initialCooldown: number) {
  const [cooldown, setCooldown] = useState(initialCooldown);

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setTimeout(() => {
      setCooldown((prev) => {
        const newValue = prev - 1;
        if (newValue === 0) {
          clearCooldownData();
        }
        return newValue;
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [cooldown]);

  return { cooldown, setCooldown };
}
