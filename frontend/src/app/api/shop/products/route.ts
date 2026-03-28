import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ok, serverError } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const page       = parseInt(searchParams.get("page")  ?? "1");
    const limit      = parseInt(searchParams.get("limit") ?? "12");
    const category   = searchParams.get("category");
    const search     = searchParams.get("search");
    const featured   = searchParams.get("featured") === "true";
    const minPrice   = parseFloat(searchParams.get("minPrice") ?? "0");
    const maxPrice   = parseFloat(searchParams.get("maxPrice") ?? "999999");
    const sort       = searchParams.get("sort") ?? "createdAt";
    const order      = (searchParams.get("order") ?? "desc") as "asc" | "desc";

    const where = {
      published: true,
      ...(category && { category: { slug: category } }),
      ...(featured && { featured: true }),
      ...(search && {
        OR: [
          { name:        { contains: search, mode: "insensitive" as const } },
          { description: { contains: search, mode: "insensitive" as const } },
        ],
      }),
      price: {
        gte: minPrice,
        ...(maxPrice < 999999 && { lte: maxPrice }),
      },
    };

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        orderBy: { [sort]: order },
        skip:  (page - 1) * limit,
        take:  limit,
        include: { category: { select: { name: true, slug: true } } },
      }),
      db.product.count({ where }),
    ]);

    return ok({
      data: products,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[PRODUCTS_GET]", error);
    return serverError();
  }
}
