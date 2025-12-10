import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { env } from "@/config/env";
import ServerAPI from "@/lib/api/server-api";
import { logger } from "@/lib/utils/logger";
import { AUTH_COOKIE_CONFIG } from "@/features/auth/shared/utils/auth.config";
import type {
  LoginResponse,
  TwoFactorRequiredResponse,
} from "@/features/auth/shared/types";
import axios from "axios";
import type { JWT } from "next-auth/jwt";

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    if (!token.refreshToken) {
      logger.error("No refresh token available", {
        action: "token_refresh_failed",
        error: "Missing refresh token",
      });
      return {
        ...token,
        error: "RefreshAccessTokenError" as const,
      };
    }

    logger.info("Attempting to refresh access token", {
      action: "token_refresh_attempt",
    });

    const response = await axios.post(
      `${env.API_URL}/auth/refresh`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": env.API_KEY,
          Cookie: `refreshToken=${token.refreshToken}`,
          "X-Server-Refresh": "true",
        },
        timeout: 10000,
      }
    );

    if (!response.data?.tokens?.accessToken) {
      logger.error("Invalid refresh response structure", {
        action: "token_refresh_failed",
        error: "Missing tokens in response",
      });
      return {
        ...token,
        error: "RefreshAccessTokenError" as const,
      };
    }

    const { accessToken } = response.data.tokens;

    const setCookieHeader = response.headers["set-cookie"];
    let newRefreshToken = token.refreshToken;

    if (setCookieHeader) {
      let refreshTokenCookie: string | undefined;

      if (Array.isArray(setCookieHeader)) {
        refreshTokenCookie = setCookieHeader.find((cookie) =>
          cookie.startsWith("refreshToken=")
        );
      } else {
        const cookieStr = setCookieHeader as string;
        refreshTokenCookie = cookieStr.startsWith("refreshToken=")
          ? cookieStr
          : undefined;
      }

      if (refreshTokenCookie) {
        const match = refreshTokenCookie.match(/refreshToken=([^;]+)/);
        if (match) {
          newRefreshToken = match[1];
          logger.info("Refresh token rotated by backend", {
            action: "token_refresh_rotated",
          });
        }
      }
    }

    logger.info("Access token refreshed successfully", {
      action: "token_refresh_success",
    });

    return {
      ...token,
      accessToken,
      refreshToken: newRefreshToken,
      accessTokenExpiry:
        Date.now() + AUTH_COOKIE_CONFIG.ACCESS_TOKEN_MAX_AGE * 1000,
      error: undefined,
    };
  } catch (error) {
    const metadata: Record<string, unknown> = {};

    if (axios.isAxiosError(error)) {
      metadata.status = error.response?.status;
      metadata.statusText = error.response?.statusText;
      metadata.code = error.code;
      metadata.url = error.config?.url;

      if (error.response?.data) {
        metadata.responseData = JSON.stringify(error.response.data);
      }
    }

    logger.error("Failed to refresh access token", {
      action: "token_refresh_failed",
      error: error instanceof Error ? error.message : "Unknown error",
      metadata,
    });

    return {
      ...token,
      error: "RefreshAccessTokenError" as const,
    };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            logger.error("Missing credentials in authorize", {
              action: "authorize_missing_credentials",
            });
            return null;
          }

          logger.info("Authorizing user via credentials", {
            action: "authorize_attempt",
          });

          const response = await ServerAPI.post<
            LoginResponse | TwoFactorRequiredResponse
          >("/auth/login", {
            email: credentials.email,
            password: credentials.password,
          });

          if ("requires2FA" in response.data && response.data.requires2FA) {
            logger.info("2FA required for user", {
              action: "authorize_2fa_required",
            });

            return {
              id: "2fa-pending",
              email: credentials.email as string,
              firstName: "",
              lastName: "",
              isEmailVerified: false,
              twoFactorEnabled: true,
              status: "2fa-pending",
              accessToken: "",
              refreshToken: "",
              companyId: null,
              role: "",
              requires2FA: true,
              tempToken: response.data.tempToken,
            };
          }

          const loginData = response.data as LoginResponse;

          const setCookieHeader = response.headers["set-cookie"];
          let refreshToken = "";

          if (setCookieHeader) {
            let refreshTokenCookie: string | undefined;

            if (Array.isArray(setCookieHeader)) {
              refreshTokenCookie = setCookieHeader.find((cookie) =>
                cookie.startsWith("refreshToken=")
              );
            } else {
              const cookieStr = setCookieHeader as string;
              refreshTokenCookie = cookieStr.startsWith("refreshToken=")
                ? cookieStr
                : undefined;
            }

            if (refreshTokenCookie) {
              const match = refreshTokenCookie.match(/refreshToken=([^;]+)/);
              if (match) {
                refreshToken = match[1];
              }
            }
          }

          logger.info("User authorized successfully", {
            action: "authorize_success",
            userId: loginData.user.id,
          });

          return {
            id: loginData.user.id,
            email: loginData.user.email,
            firstName: loginData.user.firstName,
            lastName: loginData.user.lastName,
            isEmailVerified: true,
            twoFactorEnabled: false,
            status: "active",
            accessToken: loginData.tokens.accessToken,
            refreshToken,
            companyId: loginData.companyId,
            role: loginData.role,
          };
        } catch (error) {
          logger.error("Authorization failed", {
            action: "authorize_failed",
            error: error instanceof Error ? error.message : "Unknown error",
          });
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      if (trigger === "update" && session) {
        logger.info("JWT callback: Session update triggered from client", {
          action: "jwt_client_update",
        });

        if (session.accessToken) {
          return {
            ...token,
            accessToken: session.accessToken,
            refreshToken: session.refreshToken || token.refreshToken,
            accessTokenExpiry:
              session.accessTokenExpiry ||
              Date.now() + AUTH_COOKIE_CONFIG.ACCESS_TOKEN_MAX_AGE * 1000,
            error: undefined,
          };
        }

        // Handle companyId update (e.g., after company creation)
        if (session.companyId !== undefined) {
          logger.info("JWT callback: Updating companyId in session", {
            action: "jwt_update_companyId",
            metadata: { companyId: session.companyId },
          });
          return {
            ...token,
            companyId: session.companyId,
          };
        }
      }

      if (account && user) {
        logger.info("JWT callback: Initial sign in", {
          action: "jwt_initial_signin",
          userId: user.id,
        });

        if (user.requires2FA) {
          return {
            ...token,
            requires2FA: true,
            tempToken: user.tempToken,
          };
        }

        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpiry:
            Date.now() + AUTH_COOKIE_CONFIG.ACCESS_TOKEN_MAX_AGE * 1000,
          companyId: user.companyId,
          role: user.role,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            isEmailVerified: user.isEmailVerified,
            twoFactorEnabled: user.twoFactorEnabled,
            status: user.status,
          },
        };
      }

      // IMPORTANT: Check token expiry with buffer
      // Refresh tokens proactively 30 seconds before they expire
      const expiryTime = token.accessTokenExpiry as number | undefined;
      const REFRESH_BUFFER = 30 * 1000; // 30 seconds

      if (expiryTime && Date.now() < expiryTime - REFRESH_BUFFER) {
        return token;
      }

      logger.info("JWT callback: Token expired or expiring soon, refreshing", {
        action: "jwt_token_expired",
      });

      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      if (token.requires2FA) {
        return {
          ...session,
          user: {
            ...session.user,
            id: "2fa-pending",
            email: token.email || "",
            firstName: "",
            lastName: "",
            isEmailVerified: false,
            twoFactorEnabled: true,
            status: "2fa-pending",
          },
          accessToken: "",
          refreshToken: "",
          companyId: null,
          role: "",
          requires2FA: true,
          tempToken: token.tempToken,
        };
      }

      if (token.error === "RefreshAccessTokenError") {
        logger.warn("Session callback: Refresh token error", {
          action: "session_refresh_error",
        });
        return {
          ...session,
          error: "RefreshAccessTokenError" as const,
        };
      }

      if (token.user) {
        return {
          ...session,
          user: {
            ...session.user,
            ...token.user,
          },
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
          accessTokenExpiry: token.accessTokenExpiry,
          companyId: token.companyId,
          role: token.role,
        };
      }

      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "strict",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
});
