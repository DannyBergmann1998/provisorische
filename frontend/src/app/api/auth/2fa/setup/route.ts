import { NextRequest } from "next/server";
import * as speakeasy from "speakeasy";
import * as QRCode from "qrcode";
import { db } from "@/lib/db";
import { ok, unauthorized, serverError, badRequest } from "@/lib/utils";

// GET: Generate 2FA secret + QR code
export async function GET(req: NextRequest) {
  const userId = req.headers.get("x-user-id");
  const userEmail = req.headers.get("x-user-email");
  if (!userId || !userEmail) return unauthorized();

  try {
    const secret = speakeasy.generateSecret({
      name:   `${process.env.TWO_FACTOR_APP_NAME ?? "HandyUndPCService"} (${userEmail})`,
      length: 32,
    });

    // Temporarily store the secret (not enabled yet until verified)
    await db.user.update({
      where: { id: userId },
      data:  { twoFactorSecret: secret.base32 },
    });

    const otpauthUrl = secret.otpauth_url!;
    const qrCode = await QRCode.toDataURL(otpauthUrl);

    return ok({ secret: secret.base32, qrCode, otpauthUrl });
  } catch (error) {
    console.error("[2FA_SETUP]", error);
    return serverError();
  }
}

// POST: Verify TOTP and enable 2FA
export async function POST(req: NextRequest) {
  const userId = req.headers.get("x-user-id");
  if (!userId) return unauthorized();

  try {
    const { token } = await req.json();
    if (!token) return badRequest("TOTP-Code fehlt.");

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { twoFactorSecret: true },
    });

    if (!user?.twoFactorSecret) {
      return badRequest("Bitte zuerst 2FA einrichten (GET /api/auth/2fa/setup).");
    }

    const isValid = speakeasy.totp.verify({
      secret:   user.twoFactorSecret,
      encoding: "base32",
      token:    String(token),
      window:   1,
    });

    if (!isValid) return badRequest("Ungültiger Code. Bitte erneut versuchen.");

    await db.user.update({
      where: { id: userId },
      data:  { twoFactorEnabled: true },
    });

    return ok({ message: "Zwei-Faktor-Authentifizierung erfolgreich aktiviert." });
  } catch (error) {
    console.error("[2FA_VERIFY]", error);
    return serverError();
  }
}

// DELETE: Disable 2FA
export async function DELETE(req: NextRequest) {
  const userId = req.headers.get("x-user-id");
  if (!userId) return unauthorized();

  try {
    const { token } = await req.json();
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { twoFactorSecret: true, twoFactorEnabled: true },
    });

    if (!user?.twoFactorEnabled) return badRequest("2FA ist nicht aktiviert.");

    const isValid = speakeasy.totp.verify({
      secret:   user.twoFactorSecret!,
      encoding: "base32",
      token:    String(token),
      window:   1,
    });

    if (!isValid) return badRequest("Ungültiger Code.");

    await db.user.update({
      where: { id: userId },
      data:  { twoFactorEnabled: false, twoFactorSecret: null },
    });

    return ok({ message: "Zwei-Faktor-Authentifizierung deaktiviert." });
  } catch (error) {
    console.error("[2FA_DELETE]", error);
    return serverError();
  }
}
