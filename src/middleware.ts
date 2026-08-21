import { getToken } from "next-auth/jwt";
import type { Role } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";
import { canAccess } from "@/lib/rbac";

function homeUntukRole(role: string): string {
  return role === "MITRA" ? "/survei" : "/dashboard";
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const role = (token?.role as string | undefined) ?? undefined;

  // Halaman login: kalau sudah login langsung arahkan ke home masing-masing role
  if (pathname === "/login") {
    if (token && role) {
      return NextResponse.redirect(new URL(homeUntukRole(role), req.url));
    }
    return NextResponse.next();
  }

  // Root (landing) publik: jika sudah login arahkan ke home
  if (pathname === "/") {
    if (token && role) {
      return NextResponse.redirect(new URL(homeUntukRole(role), req.url));
    }
    return NextResponse.next();
  }

  if (!token) {
    const url = new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, req.url);
    return NextResponse.redirect(url);
  }

  if (!canAccess(role as Role | undefined, pathname)) {
    return NextResponse.redirect(new URL(homeUntukRole(role!), req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Cocokkan semua path kecuali:
     * - /api  (REST endpoint; proteksinya di-handle sendiri di tiap route)
     * - _next/static, _next/image
     * - manifest PWA, service worker, favicon
     * - file statis (.png, .svg, .jpg, .ico, .webp)
     */
    "/((?!api|_next/static|_next/image|manifest.webmanifest|sw.js|workbox-|favicon.ico|icons|.*\\.(?:png|svg|jpg|jpeg|ico|webp)$).*)",
  ],
};