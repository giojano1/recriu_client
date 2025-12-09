import { headers } from "next/headers";

export async function validateCSRF(): Promise<{
  isValid: boolean;
  origin?: string;
  host?: string;
}> {
  const headersList = await headers();
  const origin = headersList.get("origin");
  const host = headersList.get("host");

  if (origin && host) {
    const originHost = new URL(origin).host;
    if (originHost !== host) {
      return { isValid: false, origin: originHost, host };
    }
  }

  return {
    isValid: true,
    origin: origin || undefined,
    host: host || undefined,
  };
}
