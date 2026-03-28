import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { buybackRequestSchema, paginationSchema } from "@/lib/validations";
import { ok, created, badRequest, unauthorized, serverError, paginate } from "@/lib/utils";
import { BUYBACK_MULTIPLIERS } from "@/types";

const MARKET_PRICES: Record<string, number> = {
  "iPhone 15 Pro":      1099,
  "iPhone 15":          849,
  "iPhone 14 Pro":      899,
  "iPhone 14":          749,
  "iPhone 13":          649,
  "Samsung Galaxy S24": 899,
  "Samsung Galaxy S23": 749,
  "Samsung Galaxy A54": 349,
  "Google Pixel 8":     749,
  // Default fallback
  "default":            300,
};

function calculateBuybackPrice(model: string, condition: string): number {
  const marketPrice = MARKET_PRICES[model] ?? MARKET_PRICES.default;
  const multiplier = BUYBACK_MULTIPLIERS[condition] ?? 0.2;
  return Math.round(marketPrice * multiplier * 100) / 100;
}

export async function GET(req: NextRequest) {
  const userId = req.headers.get("x-user-id");
  if (!userId) return unauthorized();

  try {
    const { searchParams } = req.nextUrl;
    const { page, limit } = paginationSchema.parse({
      page:  searchParams.get("page"),
      limit: searchParams.get("limit"),
    });

    const [buybacks, total] = await Promise.all([
      db.buyback.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        ...paginate(page, limit),
        include: { uploads: { select: { id: true, filename: true, url: true } } },
      }),
      db.buyback.count({ where: { userId } }),
    ]);

    return ok({
      data: buybacks,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[BUYBACKS_GET]", error);
    return serverError();
  }
}

export async function POST(req: NextRequest) {
  const userId = req.headers.get("x-user-id");
  if (!userId) return unauthorized();

  try {
    const body = await req.json();
    const result = buybackRequestSchema.safeParse(body);
    if (!result.success) {
      return badRequest("Validierungsfehler", result.error.flatten().fieldErrors as Record<string, string[]>);
    }

    const { deviceType, deviceModel, serialNumber, condition, description } = result.data;

    // Sanitize input: remove whitespace and normalize to uppercase
    const sanitizedSerialNumber = serialNumber.trim().toUpperCase();

    // Validate IMEI (15 digits) or serial number (flexible but alphanumeric)
    if (!(/^\d{15}$/.test(sanitizedSerialNumber) || /^[A-Z0-9]{6,50}$/.test(sanitizedSerialNumber))) {
      return badRequest("Validierungsfehler", {
        serialNumber: ["Bitte gib eine gültige Seriennummer oder IMEI ein"],
      });
    }

    const offeredPrice = calculateBuybackPrice(deviceModel, condition);

    const buyback = await db.buyback.create({
      data: {
        userId,
        deviceType,
        deviceModel,
        serialNumber: sanitizedSerialNumber,
        condition,
        description,
        offeredPrice,
      },
    });

    // Log the submission for audit trail
    console.log("[BUYBACK_CREATED]", {
      id: buyback.id,
      userId,
      deviceModel,
      serialNumber: sanitizedSerialNumber,
      timestamp: new Date().toISOString(),
    });

    return created({ ...buyback, offeredPrice });
  } catch (error) {
    console.error("[BUYBACKS_POST]", error);
    return serverError();
  }
}
