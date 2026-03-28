import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ok, unauthorized, serverError } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const userId = req.headers.get("x-user-id");
  if (!userId) return unauthorized();

  try {
    const { searchParams } = req.nextUrl;
    const page  = parseInt(searchParams.get("page")  ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "10");

    const [orders, total] = await Promise.all([
      db.order.findMany({
        where:   { userId },
        orderBy: { createdAt: "desc" },
        skip:  (page - 1) * limit,
        take:  limit,
        include: {
          items: {
            include: { product: { select: { name: true, images: true, slug: true } } },
          },
          payment: { select: { status: true } },
          invoice: { select: { id: true, number: true, pdfUrl: true } },
        },
      }),
      db.order.count({ where: { userId } }),
    ]);

    return ok({
      data: orders,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[ORDERS_GET]", error);
    return serverError();
  }
}
