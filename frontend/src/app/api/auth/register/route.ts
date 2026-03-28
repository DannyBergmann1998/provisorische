import { NextRequest } from "next/server";
import * as argon2 from "argon2";
import { nanoid } from "nanoid";
import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/email";
import { registerSchema } from "@/lib/validations";
import { authLimiter } from "@/lib/rate-limit";
import { badRequest, conflict, created, serverError } from "@/lib/utils";

export async function POST(req: NextRequest) {
  // Rate limiting
  const limited = await authLimiter(req);
  if (limited) return limited;

  try {
    const body = await req.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return badRequest("Validierungsfehler", result.error.flatten().fieldErrors as Record<string, string[]>);
    }

    const { email, password, name, phone } = result.data;

    // Check for existing user
    const existing = await db.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      return conflict("Diese E-Mail-Adresse ist bereits registriert.");
    }

    // Hash password with argon2id
    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 65536, // 64 MB
      timeCost:   3,
      parallelism: 4,
    });

    // Create user + verification token in a transaction
    const verificationToken = nanoid(64);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    const user = await db.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email:    email.toLowerCase(),
          password: hashedPassword,
          name,
          phone,
        },
        select: { id: true, email: true, name: true },
      });

      await tx.verificationToken.create({
        data: {
          token:     verificationToken,
          userId:    newUser.id,
          expiresAt,
        },
      });

      return newUser;
    });

    // Send verification email (non-blocking)
    sendVerificationEmail(user.email, user.name ?? "Nutzer", verificationToken).catch(console.error);

    return created({
      message: "Konto erstellt. Bitte überprüfe deine E-Mails zur Bestätigung.",
      userId: user.id,
    });
  } catch (error) {
    console.error("[REGISTER]", error);
    return serverError();
  }
}
