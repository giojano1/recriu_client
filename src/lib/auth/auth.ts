import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { env } from "@/config/env";
import ServerAPI from "@/lib/api/server-api";
import { logger } from "@/lib/utils/logger";
import { AUTH_COOKIE_CONFIG } from "@/features/auth/utils/auth.config";
import type {
  LoginResponse,
  TwoFactorRequiredResponse,
} from "@/features/auth/types";
import axios from "axios";
import type { JWT } from "next-auth/jwt";

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    // Validate refresh token exists
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

    // Call the NestJS refresh endpoint with refreshToken in cookie
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

    // Validate response structure
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

    // Check if backend rotated the refreshToken (in Set-Cookie header)
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

    // Add axios-specific error details
    if (axios.isAxiosError(error)) {
      metadata.status = error.response?.status;
      metadata.statusText = error.response?.statusText;
      metadata.code = error.code;
      metadata.url = error.config?.url;

      // Log response data if available (but sanitize it)
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

          // Call the NestJS login endpoint
          const response = await ServerAPI.post<
            LoginResponse | TwoFactorRequiredResponse
          >("/auth/login", {
            email: credentials.email,
            password: credentials.password,
          });

          // Handle 2FA required response
          if ("requires2FA" in response.data && response.data.requires2FA) {
            logger.info("2FA required for user", {
              action: "authorize_2fa_required",
            });

            // Return a special user object indicating 2FA is required
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

          // Handle standard login success
          const loginData = response.data as LoginResponse;

          // Extract refreshToken from Set-Cookie header
          const setCookieHeader = response.headers["set-cookie"];
          let refreshToken = "";

          if (setCookieHeader) {
            let refreshTokenCookie: string | undefined;

            if (Array.isArray(setCookieHeader)) {
              refreshTokenCookie = setCookieHeader.find((cookie) =>
                cookie.startsWith("refreshToken=")
              );
            } else {
              // setCookieHeader is a string
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
    async jwt({ token, user, account }) {
      // Initial sign in - user object is available
      if (account && user) {
        logger.info("JWT callback: Initial sign in", {
          action: "jwt_initial_signin",
          userId: user.id,
        });

        // Check if 2FA is required
        if (user.requires2FA) {
          // Don't create a full session for 2FA pending state
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

      // Return previous token if the access token has not expired yet
      const expiryTime = token.accessTokenExpiry as number | undefined;
      if (expiryTime && Date.now() < expiryTime) {
        return token;
      }

      // Access token has expired, try to refresh it
      logger.info("JWT callback: Token expired, refreshing", {
        action: "jwt_token_expired",
      });
      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      // Handle 2FA pending state
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

      // Handle refresh error
      if (token.error === "RefreshAccessTokenError") {
        logger.warn("Session callback: Refresh token error", {
          action: "session_refresh_error",
        });
        return {
          ...session,
          error: "RefreshAccessTokenError" as const,
        };
      }

      // Return normal session with user data and tokens
      // Ensure user is always defined with fallback values
      if (token.user) {
        return {
          ...session,
          user: {
            ...session.user,
            ...token.user,
          },
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
          companyId: token.companyId,
          role: token.role,
        };
      }

      // Fallback if no user in token (shouldn't happen in normal flow)
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
