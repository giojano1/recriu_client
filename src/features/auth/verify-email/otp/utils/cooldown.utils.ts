import { safeLocalStorage } from "@/features/auth/shared/utils/safe-storage.util";
import { AUTH_COOKIE_CONFIG } from "@/features/auth/shared/utils/auth.config";
import { CooldownData } from "@/features/auth/shared/types";
import { logger } from "@/lib/utils/logger";

export function getInitialCooldown(email: string): number {
  const stored = safeLocalStorage.getJSON<CooldownData>(
    AUTH_COOKIE_CONFIG.COOLDOWN_STORAGE_KEY
  );

  if (!stored || stored.email !== email) {
    return 0;
  }

  const remaining = Math.max(
    0,
    Math.floor((stored.expiresAt - Date.now()) / 1000)
  );

  if (remaining === 0) {
    clearCooldownData();
  }

  return remaining;
}

export function saveCooldownData(email: string): boolean {
  const cooldownData: CooldownData = {
    expiresAt: Date.now() + AUTH_COOKIE_CONFIG.RESEND_COOLDOWN * 1000,
    email,
  };

  const success = safeLocalStorage.setJSON(
    AUTH_COOKIE_CONFIG.COOLDOWN_STORAGE_KEY,
    cooldownData
  );

  if (!success) {
    logger.error("Failed to save cooldown data", {
      action: "resend_cooldown_save_failed",
    });
  }

  return success;
}

export function clearCooldownData(): void {
  safeLocalStorage.removeItem(AUTH_COOKIE_CONFIG.COOLDOWN_STORAGE_KEY);
}
