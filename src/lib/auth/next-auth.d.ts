import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `auth()`, `useSession()`, `getSession()` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      isEmailVerified: boolean;
      twoFactorEnabled: boolean;
      status: string;
    } & DefaultSession["user"];
    accessToken?: string;
    refreshToken?: string;
    companyId?: string | null;
    role?: string;
    error?: "RefreshAccessTokenError";
    requires2FA?: boolean;
    tempToken?: string;
  }

  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isEmailVerified: boolean;
    twoFactorEnabled: boolean;
    status: string;
    accessToken: string;
    refreshToken: string;
    companyId: string | null;
    role: string;
    requires2FA?: boolean;
    tempToken?: string;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpiry?: number;
    companyId?: string | null;
    role?: string;
    user?: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      isEmailVerified: boolean;
      twoFactorEnabled: boolean;
      status: string;
    };
    error?: "RefreshAccessTokenError";
    requires2FA?: boolean;
    tempToken?: string;
  }
}
