import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { createProductSchema, paginationSchema } from "@/lib/validations";
import { ok, created, badRequest, conflict, serverError } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const { page, limit, search, order } = paginationSchema.parse({
      page:   searchParams.get("page"),
      limit:  searchParams.get("limit"),
      search: searchParams.get("search"),
      order:  searchParams.get("order"),
    });

    const where = search
      ? { OR: [{ name: { contains: search, mode: "insensitive" as const } }] }
      : {};

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        orderBy: { createdAt: order },
        skip: (page - 1) * limit,
        take: limit,
        include: { category: { select: { name: true, slug: true } } },
      }),
      db.product.count({ where }),
    ]);

    return ok({
      data: products,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[ADMIN_PRODUCTS_GET]", error);
    return serverError();
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = createProductSchema.safeParse(body);
    if (!result.success) {
      return badRequest("Validierungsfehler", result.error.flatten().fieldErrors as Record<string, string[]>);
    }

    const existing = await db.product.findUnique({ where: { slug: result.data.slug } });
    if (existing) return conflict("Ein Produkt mit diesem Slug existiert bereits.");

    const product = await db.product.create({ data: result.data });
    return created(product);
  } catch (error) {
    console.error("[ADMIN_PRODUCTS_POST]", error);
    return serverError();
  }
}
