import { hashPII } from "@/lib/utils/hash-pii";

/**
 * Hashes company slug for privacy-conscious logging
 * @param slug - Company slug to hash
 * @returns Hashed slug with prefix
 */
export function hashCompanySlug(slug: string): string {
  return `slug_${hashPII(slug.toLowerCase())}`;
}

/**
 * Hashes company name for privacy-conscious logging
 * @param name - Company name to hash
 * @returns Hashed name with prefix
 */
export function hashCompanyName(name: string): string {
  return `name_${hashPII(name.toLowerCase())}`;
}
