import type { JWT } from "next-auth/jwt";

/**
 * In-memory cache for deduplicating concurrent token refresh attempts.
 *
 * When multiple requests detect an expired token simultaneously,
 * this cache ensures only one refresh API call is made.
 * Subsequent concurrent requests wait for the same promise to resolve.
 *
 * Key: refreshToken string
 * Value: Promise<JWT> representing the ongoing refresh operation
 */
const refreshPromiseCache = new Map<string, Promise<JWT>>();

/**
 * Check if a refresh is already in progress for this token.
 *
 * @param refreshToken - The refresh token to check
 * @returns The ongoing refresh promise if one exists, undefined otherwise
 */
export function getCachedRefresh(
  refreshToken: string
): Promise<JWT> | undefined {
  return refreshPromiseCache.get(refreshToken);
}

/**
 * Cache a refresh promise to deduplicate concurrent refresh attempts.
 * The promise is automatically removed from cache when it completes (success or failure).
 *
 * @param refreshToken - The refresh token being used for the refresh
 * @param promise - The promise representing the refresh operation
 */
export function setCachedRefresh(
  refreshToken: string,
  promise: Promise<JWT>
): void {
  refreshPromiseCache.set(refreshToken, promise);

  // Auto-cleanup: Remove from cache when promise settles (success or failure)
  promise.finally(() => {
    refreshPromiseCache.delete(refreshToken);
  });
}
