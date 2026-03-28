import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ok, serverError } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const page   = parseInt(searchParams.get("page")   ?? "1");
    const limit  = parseInt(searchParams.get("limit")  ?? "20");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { deviceModel: { contains: search, mode: "insensitive" } },
        { issue:       { contains: search, mode: "insensitive" } },
        { user: { email: { contains: search, mode: "insensitive" } } },
        { user: { name:  { contains: search, mode: "insensitive" } } },
      ];
    }

    const [repairs, total] = await Promise.all([
      db.repair.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip:  (page - 1) * limit,
        take:  limit,
        include: {
          user:    { select: { id: true, name: true, email: true, phone: true } },
          uploads: { select: { id: true, filename: true, url: true } },
          invoice: { select: { id: true, number: true, pdfUrl: true } },
        },
      }),
      db.repair.count({ where }),
    ]);

    return ok({
      data: repairs,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[ADMIN_REPAIRS_GET]", error);
    return serverError();
  }
}
