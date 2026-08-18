import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/*
  Next.js Edge Middleware: UX Authentication Guard
  Note: This middleware checks whether the httpOnly `cs_token` cookie exists.
  The true security boundary remains the backend, which strictly verifies the JWT bearer token on every request.
*/

export function middleware(request: NextRequest) {
  const token = request.cookies.get("cs_token")?.value;
  const { pathname, search } = request.nextUrl;

  const protectedRoutes = ["/dashboard", "/claims", "/fraud", "/analytics", "/copilot"];
  const isProtected = protectedRoutes.some((route) =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtected && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect logged-in users away from /login and /signup to /dashboard
  if ((pathname === "/login" || pathname === "/signup") && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/claims/:path*",
    "/fraud/:path*",
    "/analytics/:path*",
    "/copilot/:path*",
    "/login",
    "/signup",
  ],
};

