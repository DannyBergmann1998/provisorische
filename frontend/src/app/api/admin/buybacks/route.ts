import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ok, serverError } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const page   = parseInt(searchParams.get("page")   ?? "1");
    const limit  = parseInt(searchParams.get("limit")  ?? "20");
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;

    const [buybacks, total] = await Promise.all([
      db.buyback.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip:  (page - 1) * limit,
        take:  limit,
        include: {
          user:    { select: { id: true, name: true, email: true, phone: true } },
          uploads: { select: { id: true, filename: true, url: true } },
        },
      }),
      db.buyback.count({ where }),
    ]);

    return ok({
      data: buybacks,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[ADMIN_BUYBACKS_GET]", error);
    return serverError();
  }
}
