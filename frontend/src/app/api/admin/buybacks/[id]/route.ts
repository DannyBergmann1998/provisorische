import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { updateBuybackSchema } from "@/lib/validations";
import { sendBuybackUpdateEmail } from "@/lib/email";
import { ok, badRequest, notFound, serverError } from "@/lib/utils";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const result = updateBuybackSchema.safeParse(body);
    if (!result.success) {
      return badRequest("Validierungsfehler", result.error.flatten().fieldErrors as Record<string, string[]>);
    }

    const buyback = await db.buyback.findUnique({
      where: { id: params.id },
      include: { user: { select: { email: true, name: true } } },
    });
    if (!buyback) return notFound("Ankaufantrag nicht gefunden.");

    const updated = await db.buyback.update({
      where: { id: params.id },
      data:  result.data,
      include: { user: { select: { email: true, name: true } } },
    });

    if (result.data.status && result.data.status !== buyback.status) {
      sendBuybackUpdateEmail(
        updated.user.email,
        updated.user.name ?? "Kunde",
        result.data.status,
        result.data.finalPrice
      ).catch(console.error);
    }

    return ok(updated);
  } catch (error) {
    console.error("[ADMIN_BUYBACK_PATCH]", error);
    return serverError();
  }
}
