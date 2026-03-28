import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { paginationSchema } from "@/lib/validations";
import { ok, serverError } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const { page, limit, search, order } = paginationSchema.parse({
      page:  searchParams.get("page"),
      limit: searchParams.get("limit"),
      search: searchParams.get("search"),
      order: searchParams.get("order"),
    });

    const where = search
      ? {
          OR: [
            { email: { contains: search, mode: "insensitive" as const } },
            { name:  { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      db.user.findMany({
        where,
        orderBy: { createdAt: order },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id:            true,
          email:         true,
          name:          true,
          phone:         true,
          role:          true,
          emailVerified: true,
          createdAt:     true,
          _count: {
            select: { repairs: true, orders: true, buybacks: true },
          },
        },
      }),
      db.user.count({ where }),
    ]);

    return ok({
      data: users,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[ADMIN_USERS_GET]", error);
    return serverError();
  }
}
