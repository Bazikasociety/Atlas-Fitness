import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

// Prisma v7 + LibSQL adapter
// - En local : DATABASE_URL="file:./dev.db"
// - En production (Turso) : DATABASE_URL="https://xxx.turso.io" + TURSO_AUTH_TOKEN="xxx"
function createPrismaClient() {
  const url = process.env.DATABASE_URL ?? "file:./dev.db";
  const authToken = process.env.TURSO_AUTH_TOKEN; // undefined en local, requis sur Turso

  // Normalise libsql:// → https:// pour compatibilité serverless (Vercel)
  const normalizedUrl = url.startsWith("libsql://")
    ? url.replace("libsql://", "https://")
    : url;

  const adapter = new PrismaLibSql({ url: normalizedUrl, authToken });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

// Singleton — évite les connexions multiples en dev (hot reload Next.js)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
