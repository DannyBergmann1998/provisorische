import { NextRequest } from "next/server";
import * as argon2 from "argon2";
import { db } from "@/lib/db";
import { revokeAllUserTokens } from "@/lib/auth";
import { resetPasswordSchema } from "@/lib/validations";
import { authLimiter } from "@/lib/rate-limit";
import { ok, badRequest, serverError } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const limited = await authLimiter(req);
  if (limited) return limited;

  try {
    const body = await req.json();
    const result = resetPasswordSchema.safeParse(body);
    if (!result.success) {
      return badRequest("Validierungsfehler", result.error.flatten().fieldErrors as Record<string, string[]>);
    }

    const { token, password } = result.data;

    const record = await db.passwordReset.findUnique({
      where: { token },
      include: { user: { select: { id: true } } },
    });

    if (!record || record.used || record.expiresAt < new Date()) {
      return badRequest("Ungültiger oder abgelaufener Link. Bitte neu anfordern.");
    }

    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost:   3,
      parallelism: 4,
    });

    await db.$transaction([
      db.user.update({ where: { id: record.userId }, data: { password: hashedPassword } }),
      db.passwordReset.update({ where: { token }, data: { used: true } }),
    ]);

    // Revoke all existing sessions for security
    await revokeAllUserTokens(record.userId);

    return ok({ message: "Passwort erfolgreich geändert. Bitte erneut anmelden." });
  } catch (error) {
    console.error("[RESET_PASSWORD]", error);
    return serverError();
  }
}
