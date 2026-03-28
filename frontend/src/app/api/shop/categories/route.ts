import { db } from "@/lib/db";
import { ok, serverError } from "@/lib/utils";

export async function GET() {
  try {
    const categories = await db.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { products: { where: { published: true } } } } },
    });
    return ok(categories);
  } catch (error) {
    console.error("[CATEGORIES_GET]", error);
    return serverError();
  }
}
