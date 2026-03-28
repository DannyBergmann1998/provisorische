import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ─── Public routes ─────────────────────────────────────────────────────────
  const publicPaths = [
    "/",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
    "/shop",
    "/impressum",
    "/datenschutz",
    "/agb",
    "/repair",
    "/buyback",
  ];

  const isPublic =
    publicPaths.some((p) => pathname === p || pathname.startsWith(p + "/")) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/uploads") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/shop/products") ||
    pathname === "/api/shop/checkout/webhook" ||
    pathname === "/api/payment/webhook" ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|webp|css|js|woff|woff2)$/);

  const accessToken = request.cookies.get("access_token")?.value;
  const payload = accessToken ? await verifyAccessToken(accessToken) : null;

  // ─── Admin protection ──────────────────────────────────────────────────────
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (!payload) {
      return pathname.startsWith("/api")
        ? NextResponse.json({ success: false, error: "Nicht autorisiert" }, { status: 401 })
        : NextResponse.redirect(new URL("/login?redirect=" + encodeURIComponent(pathname), request.url));
    }
    if (payload.role !== "ADMIN" && payload.role !== "SUPERADMIN") {
      return pathname.startsWith("/api")
        ? NextResponse.json({ success: false, error: "Zugriff verweigert" }, { status: 403 })
        : NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // ─── Dashboard protection ──────────────────────────────────────────────────
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/checkout")) {
    if (!payload) {
      return NextResponse.redirect(new URL("/login?redirect=" + encodeURIComponent(pathname), request.url));
    }
    return NextResponse.next();
  }

  // ─── Protected API routes ──────────────────────────────────────────────────
  if (
    pathname.startsWith("/api/") &&
    !isPublic
  ) {
    if (!payload) {
      return NextResponse.json({ success: false, error: "Nicht autorisiert" }, { status: 401 });
    }
    // Inject user info into headers for route handlers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id",    payload.sub);
    requestHeaders.set("x-user-email", payload.email);
    requestHeaders.set("x-user-role",  payload.role);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // ─── Redirect logged-in users away from auth pages ─────────────────────────
  if (payload && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
