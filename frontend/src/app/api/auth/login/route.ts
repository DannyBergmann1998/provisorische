import { NextRequest } from "next/server";
import * as argon2 from "argon2";
import * as speakeasy from "speakeasy";
import { db } from "@/lib/db";
import {
  createAccessToken,
  createRefreshToken,
  setAuthCookies,
  storeRefreshToken,
} from "@/lib/auth";
import { loginSchema } from "@/lib/validations";
import { authLimiter } from "@/lib/rate-limit";
import { badRequest, ok, serverError, unauthorized } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const limited = await authLimiter(req);
  if (limited) return limited;

  try {
    const body = await req.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return badRequest("Validierungsfehler", result.error.flatten().fieldErrors as Record<string, string[]>);
    }

    const { email, password, totp } = result.data;

    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id:               true,
        email:            true,
        name:             true,
        password:         true,
        role:             true,
        emailVerified:    true,
        twoFactorEnabled: true,
        twoFactorSecret:  true,
        avatarUrl:        true,
      },
    });

    // Always run a hash comparison to prevent timing attacks
    const dummyHash = "$argon2id$v=19$m=65536,t=3,p=4$placeholder$placeholder";
    const isValid = user
      ? await argon2.verify(user.password, password)
      : await argon2.verify(dummyHash, "dummy").catch(() => false);

    if (!user || !isValid) {
      return unauthorized("Ungültige E-Mail-Adresse oder Passwort.");
    }

    if (!user.emailVerified) {
      return unauthorized("Bitte bestätige zuerst deine E-Mail-Adresse.");
    }

    // 2FA check
    if (user.twoFactorEnabled && user.twoFactorSecret) {
      if (!totp) {
        return ok({ requiresTwoFactor: true });
      }
      const valid = speakeasy.totp.verify({
        secret:   user.twoFactorSecret,
        encoding: "base32",
        token:    totp,
        window:   1,
      });
      if (!valid) {
        return unauthorized("Ungültiger 2FA-Code.");
      }
    }

    const tokenPayload = { sub: user.id, email: user.email, role: user.role };
    const [accessToken, refreshToken] = await Promise.all([
      createAccessToken(tokenPayload),
      createRefreshToken(tokenPayload),
    ]);

    const ipAddress = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || undefined;
    const userAgent = req.headers.get("user-agent") || undefined;

    await storeRefreshToken(user.id, refreshToken, userAgent, ipAddress);
    setAuthCookies(accessToken, refreshToken);

    return ok({
      user: {
        id:               user.id,
        email:            user.email,
        name:             user.name,
        role:             user.role,
        emailVerified:    user.emailVerified,
        twoFactorEnabled: user.twoFactorEnabled,
        avatarUrl:        user.avatarUrl,
      },
    });
  } catch (error) {
    console.error("[LOGIN]", error);
    return serverError();
  }
}
