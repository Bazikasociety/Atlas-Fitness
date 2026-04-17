import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

// Prisma v7 + SQLite : adapter libsql requis pour le client engine (Wasm)
function createPrismaClient() {
  const url = process.env.DATABASE_URL ?? "file:./dev.db";
  const adapter = new PrismaLibSql({ url });
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
