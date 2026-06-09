import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("user_session");
  const pathname = request.nextUrl.pathname;

  // Protect Dashboard, Manifest, and Shipment routes
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/manifest") ||
    pathname.startsWith("/create-shipment") ||
    pathname.startsWith("/edit-shipment")
  ) {
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/home?login=true", request.url));
    }

    try {
      const session = JSON.parse(decodeURIComponent(sessionCookie.value));
      const allowedRoles = ["Admin", "Owner"];
      
      if (!allowedRoles.includes(session.role)) {
        return NextResponse.redirect(new URL("/home?login=true", request.url));
      }

      // Owner specific routes
      if (pathname.startsWith("/dashboard/manage-admins") && session.role !== "Owner") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/home?login=true", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/manifest/:path*',
    '/create-shipment/:path*',
    '/edit-shipment/:path*'
  ],
};
