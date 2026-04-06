import { PrismaClient } from "@prisma/client";

declare global {
  var __prisma: PrismaClient | undefined;
}

export const prisma =
  global.__prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.__prisma = prisma;
}

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export async function withDbFallback<T>(query: () => Promise<T>, fallback: T) {
  if (!isDatabaseConfigured()) {
    return fallback;
  }

  try {
    return await query();
  } catch (error) {
    console.warn("Database fallback engaged:", error);
    return fallback;
  }
}
