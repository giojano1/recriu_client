import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth/auth";
import { authRoutes, companyRoutes, dashboardRoutes } from "./constants/routes";
import { AUTH_COOKIE_CONFIG } from "./features/auth/shared/utils/auth.config";

const ROUTE_CONFIG = {
  // Routes that require authentication
  PROTECTED_ROUTES: ["/dashboard"] as const,

  // Routes that should redirect to dashboard if already authenticated
  AUTH_ROUTES: Object.values(authRoutes),

  // Company routes - users with company should not access these
  COMPANY_ROUTES: ["/company"] as const,

  // Special 2FA route that has different logic
  TWO_FA_ROUTE: "/auth/login/2fa",

  // Default redirect destinations
  DEFAULT_LOGIN_REDIRECT: dashboardRoutes.DASHBOARD, // Where to go after successful login
  DEFAULT_LOGOUT_REDIRECT: authRoutes.LOGIN, // Where to go when not authenticated
  COMPANY_CREATE_REDIRECT: companyRoutes.CREATE, // Where to go for company creation
} as const;

const COOKIE_NAMES = {
  SESSION_TOKEN: AUTH_COOKIE_CONFIG.SESSION_COOKIE_NAME,
  CALLBACK_URL: AUTH_COOKIE_CONFIG.CALLBACK_URL_COOKIE_NAME,
} as const;

/**
 * Check if a path matches any of the given route patterns
 * Handles both exact matches and prefix matches (e.g., /account and /account/*)
 */
function matchesRoutePattern(
  pathname: string,
  patterns: readonly string[]
): boolean {
  return patterns.some((pattern) => {
    // Exact match or starts with pattern + /
    return pathname === pattern || pathname.startsWith(`${pattern}/`);
  });
}

/**
 * Extract callback URL from request, with validation
 * Checks both query parameters and cookies
 */
function getCallbackUrl(request: NextRequest): string | null {
  // Check query parameter first (takes precedence)
  const callbackFromQuery = request.nextUrl.searchParams.get("callbackUrl");
  if (callbackFromQuery) {
    return callbackFromQuery;
  }

  // Check cookie as fallback
  const callbackFromCookie = request.cookies.get(
    COOKIE_NAMES.CALLBACK_URL
  )?.value;
  return callbackFromCookie || null;
}

/**
 * Create a redirect response with preserved callback URL
 * This ensures users return to their intended destination after login
 */
function redirectWithCallback(
  url: string,
  request: NextRequest,
  preserveCallback: boolean = false
): NextResponse {
  const redirectUrl = new URL(url, request.url);

  if (preserveCallback) {
    const currentPath = request.nextUrl.pathname;
    const currentSearch = request.nextUrl.search;
    const callbackUrl = `${currentPath}${currentSearch}`;

    if (
      !redirectUrl.searchParams.has("callbackUrl") &&
      currentPath !== ROUTE_CONFIG.DEFAULT_LOGOUT_REDIRECT
    ) {
      redirectUrl.searchParams.set("callbackUrl", callbackUrl);
    }
  }

  return NextResponse.redirect(redirectUrl);
}

function clearAuthCookies(response: NextResponse): NextResponse {
  response.cookies.delete(COOKIE_NAMES.SESSION_TOKEN);

  response.cookies.delete(COOKIE_NAMES.CALLBACK_URL);

  return response;
}

/**
 * Main proxy function - This is the new Next.js 16 pattern
 **/
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const session = await auth();

  const isProtectedRoute = matchesRoutePattern(
    pathname,
    ROUTE_CONFIG.PROTECTED_ROUTES
  );
  const isAuthRoute = matchesRoutePattern(pathname, ROUTE_CONFIG.AUTH_ROUTES);
  const isCompanyRoute = matchesRoutePattern(
    pathname,
    ROUTE_CONFIG.COMPANY_ROUTES
  );
  const is2FARoute = pathname === ROUTE_CONFIG.TWO_FA_ROUTE;

  if (session?.error === "RefreshAccessTokenError") {
    // Create login URL with session expiry notification
    const loginUrl = new URL(ROUTE_CONFIG.DEFAULT_LOGOUT_REDIRECT, request.url);
    loginUrl.searchParams.set('reason', 'session_expired');

    // Preserve callback URL for protected routes
    if (isProtectedRoute) {
      const currentPath = request.nextUrl.pathname;
      const currentSearch = request.nextUrl.search;
      const callbackUrl = `${currentPath}${currentSearch}`;

      if (currentPath !== ROUTE_CONFIG.DEFAULT_LOGOUT_REDIRECT) {
        loginUrl.searchParams.set("callbackUrl", callbackUrl);
      }
    }

    const response = NextResponse.redirect(loginUrl);

    // Clear all auth cookies to force fresh login
    return clearAuthCookies(response);
  }

  if (session?.requires2FA === true) {
    // Allow access to 2FA route
    if (is2FARoute) {
      return NextResponse.next();
    }

    // Redirect all other routes to 2FA page
    // Don't preserve callback here - they must complete 2FA first
    return redirectWithCallback(ROUTE_CONFIG.TWO_FA_ROUTE, request, false);
  }

  if (session) {
    const hasCompany =
      session.companyId !== null && session.companyId !== undefined;

    // Block dashboard access without company
    if (!hasCompany && isProtectedRoute) {
      return redirectWithCallback(
        ROUTE_CONFIG.COMPANY_CREATE_REDIRECT,
        request,
        false // Don't preserve callback - must complete company creation first
      );
    }

    // Block company creation if already has company
    if (hasCompany && isCompanyRoute) {
      return NextResponse.redirect(
        new URL(ROUTE_CONFIG.DEFAULT_LOGIN_REDIRECT, request.url)
      );
    }
  }

  if (session && isAuthRoute) {
    // Check if there's a callback URL to redirect to after login
    const callbackUrl = getCallbackUrl(request);

    if (callbackUrl) {
      if (callbackUrl.startsWith("/") && !callbackUrl.startsWith("//")) {
        return NextResponse.redirect(new URL(callbackUrl, request.url));
      }
    }

    // No valid callback, redirect to default dashboard
    return NextResponse.redirect(
      new URL(ROUTE_CONFIG.DEFAULT_LOGIN_REDIRECT, request.url)
    );
  }

  if (!session && isProtectedRoute) {
    return redirectWithCallback(
      ROUTE_CONFIG.DEFAULT_LOGOUT_REDIRECT,
      request,
      true
    );
  }

  if (is2FARoute && !session?.requires2FA) {
    if (session) {
      // User is fully logged in, go to dashboard
      return NextResponse.redirect(
        new URL(ROUTE_CONFIG.DEFAULT_LOGIN_REDIRECT, request.url)
      );
    } else {
      // User is not logged in, go to regular login
      return NextResponse.redirect(
        new URL(ROUTE_CONFIG.DEFAULT_LOGOUT_REDIRECT, request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files - JS/CSS chunks)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with common extensions (images, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
