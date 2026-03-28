import { NextRequest } from "next/server";
import { nanoid } from "nanoid";
import { db } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";
import { forgotPasswordSchema } from "@/lib/validations";
import { authLimiter } from "@/lib/rate-limit";
import { ok, badRequest, serverError } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const limited = await authLimiter(req);
  if (limited) return limited;

  try {
    const body = await req.json();
    const result = forgotPasswordSchema.safeParse(body);
    if (!result.success) return badRequest("Ungültige E-Mail-Adresse.");

    const { email } = result.data;

    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true, name: true, email: true },
    });

    // Always return success to prevent user enumeration
    if (!user) {
      return ok({ message: "Wenn ein Konto mit dieser E-Mail existiert, wurde ein Link gesendet." });
    }

    // Invalidate old tokens
    await db.passwordReset.updateMany({
      where: { userId: user.id, used: false },
      data: { used: true },
    });

    const token = nanoid(64);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await db.passwordReset.create({
      data: { token, userId: user.id, expiresAt },
    });

    sendPasswordResetEmail(user.email, user.name ?? "Nutzer", token).catch(console.error);

    return ok({ message: "Wenn ein Konto mit dieser E-Mail existiert, wurde ein Link gesendet." });
  } catch (error) {
    console.error("[FORGOT_PASSWORD]", error);
    return serverError();
  }
}
