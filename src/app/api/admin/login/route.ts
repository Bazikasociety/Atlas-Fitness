import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "atlas-fitness-secret"
);

// POST — Authentification admin par mot de passe
export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });
  }

  // Génère un JWT valide 7 jours
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);

  const response = NextResponse.json({ success: true });
  response.cookies.set("atlas_admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 jours
    path: "/",
  });

  return response;
}

// DELETE — Déconnexion
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("atlas_admin_token");
  return response;
}
