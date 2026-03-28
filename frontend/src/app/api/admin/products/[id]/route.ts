import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { createProductSchema } from "@/lib/validations";
import { ok, badRequest, notFound, serverError } from "@/lib/utils";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const result = createProductSchema.partial().safeParse(body);
    if (!result.success) {
      return badRequest("Validierungsfehler", result.error.flatten().fieldErrors as Record<string, string[]>);
    }

    const product = await db.product.findUnique({ where: { id: params.id } });
    if (!product) return notFound("Produkt nicht gefunden.");

    const updated = await db.product.update({
      where: { id: params.id },
      data:  result.data,
    });
    return ok(updated);
  } catch (error) {
    console.error("[ADMIN_PRODUCT_PATCH]", error);
    return serverError();
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await db.product.findUnique({ where: { id: params.id } });
    if (!product) return notFound("Produkt nicht gefunden.");

    await db.product.delete({ where: { id: params.id } });
    return ok({ message: "Produkt gelöscht." });
  } catch (error) {
    console.error("[ADMIN_PRODUCT_DELETE]", error);
    return serverError();
  }
}
