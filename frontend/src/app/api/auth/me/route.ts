import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ok, unauthorized, serverError, badRequest } from "@/lib/utils";
import { updateProfileSchema } from "@/lib/validations";

export async function GET(req: NextRequest) {
  const userId = req.headers.get("x-user-id");
  if (!userId) return unauthorized();

  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id:               true,
        email:            true,
        name:             true,
        phone:            true,
        address:          true,
        role:             true,
        emailVerified:    true,
        twoFactorEnabled: true,
        avatarUrl:        true,
        createdAt:        true,
      },
    });

    if (!user) return unauthorized("Nutzer nicht gefunden.");
    return ok(user);
  } catch (error) {
    console.error("[ME_GET]", error);
    return serverError();
  }
}

export async function PATCH(req: NextRequest) {
  const userId = req.headers.get("x-user-id");
  if (!userId) return unauthorized();

  try {
    const body = await req.json();
    const result = updateProfileSchema.safeParse(body);
    if (!result.success) {
      return badRequest("Validierungsfehler", result.error.flatten().fieldErrors as Record<string, string[]>);
    }

    const updated = await db.user.update({
      where: { id: userId },
      data:  result.data,
      select: {
        id:      true,
        email:   true,
        name:    true,
        phone:   true,
        address: true,
      },
    });

    return ok(updated);
  } catch (error) {
    console.error("[ME_PATCH]", error);
    return serverError();
  }
}
