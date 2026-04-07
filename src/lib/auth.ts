import { verify as verifyArgon2, hash as hashArgon2 } from "@node-rs/argon2";
import { UserRole } from "@prisma/client";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createAuditLog } from "@/lib/audit";
import { sessionCookieName } from "@/lib/constants";
import { prisma, isDatabaseConfigured } from "@/lib/prisma";
import type { SessionUser } from "@/lib/types";

const sessionDurationSeconds = 60 * 60 * 24 * 7;

function getSeedSuperAdminLogin() {
  const email = process.env.SEED_SUPER_ADMIN_EMAIL?.toLowerCase().trim();
  const password = process.env.SEED_SUPER_ADMIN_PASSWORD;

  if (!email || !password) {
    return null;
  }

  return {
    email,
    password,
    name: process.env.SEED_SUPER_ADMIN_NAME || "Sarajevo Rezervacije",
  };
}

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("AUTH_SECRET is not configured.");
  }

  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string) {
  return hashArgon2(password);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return verifyArgon2(passwordHash, password);
}

async function signSession(user: SessionUser) {
  return new SignJWT({ ...user } as Record<string, string>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(sessionDurationSeconds)
    .sign(getAuthSecret());
}

export async function createAdminSession(user: SessionUser) {
  const token = await signSession(user);
  const cookieStore = await cookies();

  cookieStore.set(sessionCookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: sessionDurationSeconds,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(sessionCookieName);
}

export async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionCookieName)?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, getAuthSecret());

    return {
      id: String(payload.id),
      email: String(payload.email),
      name: String(payload.name),
      role: payload.role as UserRole,
    } satisfies SessionUser;
  } catch {
    return null;
  }
}

export async function requireSession(roles?: UserRole[]) {
  const session = await getSessionUser();

  if (!session) {
    redirect("/admin/prijava");
  }

  let activeSession = session;

  if (isDatabaseConfigured()) {
    const currentUser = await prisma.user.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
      },
    });

    if (!currentUser || !currentUser.isActive) {
      await clearAdminSession();
      redirect("/admin/prijava");
    }

    if (
      currentUser.email !== session.email ||
      currentUser.name !== session.name ||
      currentUser.role !== session.role
    ) {
      activeSession = {
        id: currentUser.id,
        email: currentUser.email,
        name: currentUser.name,
        role: currentUser.role,
      };

      await createAdminSession(activeSession);
    }

    if (roles && !roles.includes(currentUser.role)) {
      redirect("/admin");
    }
  } else if (roles && !roles.includes(session.role)) {
    redirect("/admin");
  }

  return activeSession;
}

export async function loginAdmin(email: string, password: string) {
  if (!isDatabaseConfigured()) {
    throw new Error("DATABASE_NOT_CONFIGURED");
  }

  const normalizedEmail = email.toLowerCase().trim();
  const seedLogin = getSeedSuperAdminLogin();
  const isSeedSuperAdminLogin = Boolean(
    seedLogin && normalizedEmail === seedLogin.email && password === seedLogin.password,
  );

  let user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user && isSeedSuperAdminLogin && seedLogin) {
    user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name: seedLogin.name,
        passwordHash: await hashPassword(password),
        role: UserRole.SUPER_ADMIN,
        isActive: true,
      },
    });
  }

  if (!user) {
    return null;
  }

  let isValid = await verifyPassword(password, user.passwordHash);

  if ((!isValid || !user.isActive || user.role !== UserRole.SUPER_ADMIN) && isSeedSuperAdminLogin && seedLogin) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: seedLogin.name,
        passwordHash: await hashPassword(password),
        role: UserRole.SUPER_ADMIN,
        isActive: true,
      },
    });
    isValid = true;
  }

  if (!user.isActive || !isValid) {
    return null;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  await createAdminSession({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  await createAuditLog({
    actorId: user.id,
    action: "auth.login",
    entityType: "AUTH",
    entityId: user.id,
    summary: `${user.email} se prijavio u admin.`,
  });

  return user;
}
