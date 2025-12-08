import crypto from "crypto";

export function hashPII(data: string): string {
  return crypto
    .createHash("sha256")
    .update(data)
    .digest("hex")
    .substring(0, 16);
}

export function hashEmail(email: string): string {
  return `email_${hashPII(email.toLowerCase())}`;
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return "***@***.***";

  const maskedLocal = local.length > 2 ? `${local.substring(0, 2)}***` : "***";

  return `${maskedLocal}@${domain}`;
}
