import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { repairRequestSchema, paginationSchema } from "@/lib/validations";
import { ok, created, badRequest, unauthorized, serverError, paginate } from "@/lib/utils";
import { REPAIR_PRICES } from "@/types";

// GET: List user's repairs
export async function GET(req: NextRequest) {
  const userId = req.headers.get("x-user-id");
  if (!userId) return unauthorized();

  try {
    const { searchParams } = req.nextUrl;
    const { page, limit } = paginationSchema.parse({
      page:  searchParams.get("page"),
      limit: searchParams.get("limit"),
    });

    const [repairs, total] = await Promise.all([
      db.repair.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        ...paginate(page, limit),
        include: {
          uploads: { select: { id: true, filename: true, url: true } },
          invoice: { select: { id: true, number: true, pdfUrl: true } },
        },
      }),
      db.repair.count({ where: { userId } }),
    ]);

    return ok({
      data: repairs,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[REPAIRS_GET]", error);
    return serverError();
  }
}

// POST: Create repair request
export async function POST(req: NextRequest) {
  const userId = req.headers.get("x-user-id");
  if (!userId) return unauthorized();

  try {
    const body = await req.json();
    const result = repairRequestSchema.safeParse(body);
    if (!result.success) {
      return badRequest("Validierungsfehler", result.error.flatten().fieldErrors as Record<string, string[]>);
    }

    const { deviceType, deviceModel, issue, description } = result.data;

    // Calculate price estimate
    const priceRange = REPAIR_PRICES[deviceType]?.[issue];
    const estimatedPrice = priceRange
      ? (priceRange.min + priceRange.max) / 2
      : undefined;

    const repair = await db.repair.create({
      data: {
        userId,
        deviceType,
        deviceModel,
        issue,
        description,
        estimatedPrice,
      },
    });

    return created(repair);
  } catch (error) {
    console.error("[REPAIRS_POST]", error);
    return serverError();
  }
}
