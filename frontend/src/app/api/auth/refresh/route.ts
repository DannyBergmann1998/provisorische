import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import {
  verifyRefreshToken,
  createAccessToken,
  createRefreshToken,
  setAuthCookies,
  storeRefreshToken,
  revokeRefreshToken,
  validateStoredRefreshToken,
  REFRESH_COOKIE,
} from "@/lib/auth";
import { db } from "@/lib/db";
import { ok, unauthorized, serverError } from "@/lib/utils";

export async function POST(_req: NextRequest) {
  try {
    const cookieStore = cookies();
    const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;

    if (!refreshToken) return unauthorized("Kein Refresh-Token vorhanden.");

    // Verify JWT signature
    const payload = await verifyRefreshToken(refreshToken);
    if (!payload) return unauthorized("Ungültiger Refresh-Token.");

    // Verify against DB (revocation check)
    const isValid = await validateStoredRefreshToken(refreshToken);
    if (!isValid) return unauthorized("Refresh-Token widerrufen oder abgelaufen.");

    // Get fresh user data
    const user = await db.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, role: true },
    });
    if (!user) return unauthorized("Nutzer nicht gefunden.");

    const tokenPayload = { sub: user.id, email: user.email, role: user.role };

    // Rotate tokens
    const [newAccessToken, newRefreshToken] = await Promise.all([
      createAccessToken(tokenPayload),
      createRefreshToken(tokenPayload),
    ]);

    await revokeRefreshToken(refreshToken);
    await storeRefreshToken(user.id, newRefreshToken);
    setAuthCookies(newAccessToken, newRefreshToken);

    return ok({ message: "Token erneuert." });
  } catch (error) {
    console.error("[REFRESH]", error);
    return serverError();
  }
}
