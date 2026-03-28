import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { clearAuthCookies, revokeRefreshToken, REFRESH_COOKIE } from "@/lib/auth";
import { ok } from "@/lib/utils";

export async function POST(_req: NextRequest) {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;

  if (refreshToken) {
    await revokeRefreshToken(refreshToken).catch(console.error);
  }

  clearAuthCookies();
  return ok({ message: "Erfolgreich abgemeldet." });
}
