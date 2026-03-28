import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ok, notFound, serverError } from "@/lib/utils";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Support both ID and slug lookup
    const product = await db.product.findFirst({
      where: {
        published: true,
        OR: [{ id: params.id }, { slug: params.id }],
      },
      include: {
        category: { select: { id: true, name: true, slug: true } },
      },
    });

    if (!product) return notFound("Produkt nicht gefunden.");
    return ok(product);
  } catch (error) {
    console.error("[PRODUCT_GET]", error);
    return serverError();
  }
}
