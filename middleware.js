import { NextResponse } from "next/server";
import { verifyToken } from "./lib/auth";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Public auth routes
  if (
    pathname.startsWith("/api/login") ||
    pathname.startsWith("/api/cookies") // ← may 's' na
  ) {
    return NextResponse.next();
  }

  // USER REGISTRATION: only POST allowed, NO AUTH CHECK
  if (pathname.startsWith("/api/users") && request.method === "POST") {
    return NextResponse.next();
  }

  // Everything else requires token
  const token = request.cookies.get("token")?.value;

  if (!token) {
    if (!pathname.startsWith("/api")) {
      return NextResponse.redirect(new URL("/Login", request.url));
    }
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = await verifyToken(token);

    // E-SIGN GUARD
    const hasEsign = decoded.e_sign && decoded.e_sign.trim() !== "";
    const isUserProfile = pathname.startsWith("/Main/Profile");
    const isApiRoute = pathname.startsWith("/api");

    if (!hasEsign && !isUserProfile && !isApiRoute) {
      return NextResponse.redirect(new URL("/Main/Profile", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    if (!pathname.startsWith("/api")) {
      return NextResponse.redirect(new URL("/Login", request.url));
    }
    return NextResponse.json({ error_message: error.message }, { status: 401 });
  }
}

export const config = {
  matcher: ["/api/:path*", "/Main/:path*"],
};
