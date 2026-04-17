import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "atlas-fitness-secret"
);

// Protège toutes les routes /admin/* sauf /admin/login
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/admin") || pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = req.cookies.get("atlas_admin_token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  try {
    await jwtVerify(token, JWT_SECRET);
    return NextResponse.next();
  } catch {
    // Token invalide ou expiré
    const response = NextResponse.redirect(new URL("/admin/login", req.url));
    response.cookies.delete("atlas_admin_token");
    return response;
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
