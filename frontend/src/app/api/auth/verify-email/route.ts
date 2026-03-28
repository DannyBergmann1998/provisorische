import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ok, badRequest, serverError } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");
    if (!token) return badRequest("Token fehlt.");

    const record = await db.verificationToken.findUnique({
      where: { token },
      include: { user: { select: { id: true, emailVerified: true } } },
    });

    if (!record) return badRequest("Ungültiger oder abgelaufener Bestätigungslink.");
    if (record.expiresAt < new Date()) {
      await db.verificationToken.delete({ where: { token } });
      return badRequest("Der Bestätigungslink ist abgelaufen. Bitte neu anfordern.");
    }
    if (record.user.emailVerified) {
      await db.verificationToken.delete({ where: { token } });
      return ok({ message: "E-Mail bereits bestätigt." });
    }

    await db.$transaction([
      db.user.update({ where: { id: record.userId }, data: { emailVerified: true } }),
      db.verificationToken.delete({ where: { token } }),
    ]);

    return ok({ message: "E-Mail erfolgreich bestätigt. Du kannst dich jetzt anmelden." });
  } catch (error) {
    console.error("[VERIFY_EMAIL]", error);
    return serverError();
  }
}
