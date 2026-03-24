import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Redirect to login if accessing dashboard without session
    if (req.nextUrl.pathname.startsWith("/dashboard") && !req.nextauth.token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow all requests
        if (req.nextUrl.pathname.startsWith("/api/auth")) {
          return true;
        }
        if (req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/signup") {
          return true;
        }
        if (req.nextUrl.pathname.startsWith("/dashboard")) {
          return !!token;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login, signup (public pages)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|login|signup).*)",
  ],
};
