import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { db } from "./db";
import type { JWTPayload, SessionUser } from "@/types";
import type { Role } from "@prisma/client";

const ACCESS_SECRET  = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET!);
const REFRESH_SECRET = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET!);

export const ACCESS_EXPIRES  = process.env.JWT_ACCESS_EXPIRES_IN  ?? "15m";
export const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES_IN ?? "7d";

// ─── Token creation ───────────────────────────────────────────────────────────

export async function createAccessToken(payload: Omit<JWTPayload, "iat" | "exp">) {
  return new SignJWT({ email: payload.email, role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(ACCESS_EXPIRES)
    .sign(ACCESS_SECRET);
}

export async function createRefreshToken(payload: Omit<JWTPayload, "iat" | "exp">) {
  return new SignJWT({ email: payload.email, role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(REFRESH_EXPIRES)
    .sign(REFRESH_SECRET);
}

// ─── Token verification ───────────────────────────────────────────────────────

export async function verifyAccessToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, ACCESS_SECRET);
    return {
      sub:   payload.sub as string,
      email: payload.email as string,
      role:  payload.role as Role,
      iat:   payload.iat,
      exp:   payload.exp,
    };
  } catch {
    return null;
  }
}

export async function verifyRefreshToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, REFRESH_SECRET);
    return {
      sub:   payload.sub as string,
      email: payload.email as string,
      role:  payload.role as Role,
      iat:   payload.iat,
      exp:   payload.exp,
    };
  } catch {
    return null;
  }
}

// ─── Cookie helpers ───────────────────────────────────────────────────────────

export const REFRESH_COOKIE = "refresh_token";
export const ACCESS_COOKIE  = "access_token";

export function setAuthCookies(accessToken: string, refreshToken: string) {
  const cookieStore = cookies();
  const isSecure = process.env.COOKIE_SECURE === "true";
  const sameSite = (process.env.COOKIE_SAME_SITE as "lax" | "strict" | "none") ?? "lax";

  cookieStore.set(ACCESS_COOKIE, accessToken, {
    httpOnly: true,
    secure: isSecure,
    sameSite,
    path: "/",
    maxAge: 60 * 15, // 15 minutes
  });

  cookieStore.set(REFRESH_COOKIE, refreshToken, {
    httpOnly: true,
    secure: isSecure,
    sameSite,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export function clearAuthCookies() {
  const cookieStore = cookies();
  cookieStore.delete(ACCESS_COOKIE);
  cookieStore.delete(REFRESH_COOKIE);
}

// ─── Session helper ───────────────────────────────────────────────────────────

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = cookies();
  const accessToken = cookieStore.get(ACCESS_COOKIE)?.value;

  if (!accessToken) return null;

  const payload = await verifyAccessToken(accessToken);
  if (!payload) return null;

  const user = await db.user.findUnique({
    where: { id: payload.sub },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      emailVerified: true,
      twoFactorEnabled: true,
      avatarUrl: true,
    },
  });

  return user;
}

export async function requireSession(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}

export async function requireAdmin(): Promise<SessionUser> {
  const session = await requireSession();
  if (session.role !== "ADMIN" && session.role !== "SUPERADMIN") {
    throw new Error("Forbidden");
  }
  return session;
}

// ─── Refresh token store ──────────────────────────────────────────────────────

export async function storeRefreshToken(
  userId: string,
  token: string,
  userAgent?: string,
  ipAddress?: string
) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await db.refreshToken.create({
    data: { token, userId, expiresAt, userAgent, ipAddress },
  });
}

export async function revokeRefreshToken(token: string) {
  await db.refreshToken.updateMany({
    where: { token },
    data: { revoked: true },
  });
}

export async function revokeAllUserTokens(userId: string) {
  await db.refreshToken.updateMany({
    where: { userId },
    data: { revoked: true },
  });
}

export async function validateStoredRefreshToken(token: string): Promise<boolean> {
  const stored = await db.refreshToken.findUnique({ where: { token } });
  if (!stored) return false;
  if (stored.revoked) return false;
  if (stored.expiresAt < new Date()) return false;
  return true;
}
