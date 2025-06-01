import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const AUTH_COOKIE_NAME = 'studyverse_auth';

// Define which routes are protected
const protectedRoutes = ['/admin', '/tutor', '/training', '/content']; // Add any other routes you want to protect

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticatedCookie = request.cookies.get(AUTH_COOKIE_NAME);

  // Check if the current path is one of the protected routes
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute && !isAuthenticatedCookie) {
    // If trying to access a protected route without authentication,
    // redirect to the landing page with a query param to trigger login modal.
    const loginUrl = new URL('/', request.url);
    loginUrl.searchParams.set('showLogin', 'true');
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - kalypso-assets (your assets)
     *
     * This ensures the middleware runs on pages but not on these utility paths.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|kalypso-assets).*)',
  ],
}; 