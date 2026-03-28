import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ok, badRequest, unauthorized, serverError } from "@/lib/utils";

/**
 * GET /api/payments/status?sessionId=xxx or ?orderId=xxx or ?repairId=xxx
 * Fetch payment status for orders, repairs, or sessions
 */
export async function GET(req: NextRequest) {
  const userId = req.headers.get("x-user-id");
  if (!userId) return unauthorized();

  try {
    const { searchParams } = req.nextUrl;
    const sessionId = searchParams.get("sessionId");
    const orderId = searchParams.get("orderId");
    const repairId = searchParams.get("repairId");

    if (!sessionId && !orderId && !repairId) {
      return badRequest("Must provide sessionId, orderId, or repairId");
    }

    // Check order status
    if (orderId) {
      const order = await db.order.findUnique({
        where: { id: orderId },
        include: { payment: true },
      });

      if (!order || order.userId !== userId) {
        return badRequest("Bestellung nicht gefunden");
      }

      return ok({
        type: "order",
        status: order.status,
        amount: order.totalAmount,
        payment: order.payment
          ? {
              id: order.payment.id,
              stripeId: order.payment.stripeId,
              status: order.payment.status,
              amount: order.payment.amount,
              currency: order.payment.currency,
            }
          : null,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      });
    }

    // Check repair status
    if (repairId) {
      const repair = await db.repair.findUnique({
        where: { id: repairId },
      });

      if (!repair || repair.userId !== userId) {
        return badRequest("Reparatur nicht gefunden");
      }

      const payment = await db.payment.findUnique({
        where: { repairId },
      });

      return ok({
        type: "repair",
        status: repair.status,
        amount: repair.finalPrice ?? repair.estimatedPrice,
        payment: payment
          ? {
              id: payment.id,
              stripeId: payment.stripeId,
              status: payment.status,
              amount: payment.amount,
              currency: payment.currency,
            }
          : null,
        createdAt: repair.createdAt,
        updatedAt: repair.updatedAt,
      });
    }

    // Session ID is not stored directly, so we can't retrieve it
    return badRequest("Cannot retrieve status by sessionId");
  } catch (error) {
    console.error("[PAYMENT_STATUS_ERROR]", error);
    return serverError();
  }
}
