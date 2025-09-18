import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value || "";

  if (!token) {
    // redirect to login if not logged in
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { role: string };

    const pathname = req.nextUrl.pathname;

    // Admin routes
    if (pathname.startsWith("/admin") && decoded.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Doctor routes
    if (pathname.startsWith("/doctor") && decoded.role !== "DOCTOR") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Pharmacy routes
    if (pathname.startsWith("/pharmacy") && decoded.role !== "PHARMACY") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/doctor/:path*", "/pharmacy/:path*"],
};
