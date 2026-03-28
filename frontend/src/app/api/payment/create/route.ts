import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { apiLimiter } from "@/lib/rate-limit";
import { createCheckoutSession, createRepairPaymentLink } from "@/lib/stripe";
import { badRequest, created, forbidden, notFound, serverError } from "@/lib/utils";

/**
 * Payment Creation Schema
 * Supports both shop orders and repair payments
 */
const paymentCreateSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("shop"),
    orderId: z.string().cuid(),
  }),
  z.object({
    type: z.literal("repair"),
    repairId: z.string().cuid(),
  }),
]);

type PaymentCreateRequest = z.infer<typeof paymentCreateSchema>;

/**
 * POST /api/payment/create
 *
 * Creates a payment session for either a shop order or repair payment
 *
 * Request body:
 * - type: "shop" | "repair"
 * - orderId: string (for shop)
 * - repairId: string (for repair)
 *
 * Response:
 * - { sessionId: string, url: string } for checkout
 * - { paymentLinkUrl: string } for repair payment link
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const rateLimitResult = apiLimiter.check(ip);
    if (!rateLimitResult.success) {
      return new NextResponse("Too many requests", {
        status: 429,
        headers: {
          "Retry-After": rateLimitResult.resetTime.toString(),
          "X-RateLimit-Limit": "100",
          "X-RateLimit-Remaining": "0",
        },
      });
    }

    // Require authenticated user
    const session = await requireSession();
    if (!session) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Parse and validate request body
    const body = await request.json().catch(() => ({}));
    const validation = paymentCreateSchema.safeParse(body);

    if (!validation.success) {
      return badRequest({
        error: "Invalid request",
        details: validation.error.flatten(),
      });
    }

    const payload: PaymentCreateRequest = validation.data;

    // Handle shop order payment
    if (payload.type === "shop") {
      const order = await db.order.findUnique({
        where: { id: payload.orderId },
        include: { items: { include: { product: true } } },
      });

      if (!order) {
        return notFound({ error: "Order not found" });
      }

      // Verify order belongs to authenticated user
      if (order.userId !== session.id) {
        return forbidden({ error: "Cannot access this order" });
      }

      // Create Stripe checkout session
      const checkoutSession = await createCheckoutSession({
        userId: session.id,
        userEmail: session.email,
        orderId: order.id,
        items: order.items.map((item) => ({
          price_data: {
            currency: "eur",
            product_data: {
              name: item.product.name,
              description: item.product.slug,
            },
            unit_amount: Math.round(item.price * 100), // Convert to cents
          },
          quantity: item.quantity,
        })),
        shippingCost: order.shippingCost ? order.shippingCost * 100 : 0,
        locale: "de",
      });

      // Update order with Stripe session ID
      await db.order.update({
        where: { id: order.id },
        data: { stripeSessionId: checkoutSession.id },
      });

      return created({
        sessionId: checkoutSession.id,
        url: checkoutSession.url,
        type: "shop",
      });
    }

    // Handle repair payment
    if (payload.type === "repair") {
      const repair = await db.repair.findUnique({
        where: { id: payload.repairId },
      });

      if (!repair) {
        return notFound({ error: "Repair not found" });
      }

      // Verify repair belongs to authenticated user
      if (repair.userId !== session.id) {
        return forbidden({ error: "Cannot access this repair" });
      }

      // Repair must be completed before payment
      if (repair.status !== "DONE") {
        return badRequest({ error: "Repair must be completed before payment" });
      }

      // Create Stripe payment link
      const paymentLink = await createRepairPaymentLink({
        repairId: repair.id,
        amount: repair.finalPrice || repair.estimatedPrice,
        description: `Repair payment - ${repair.deviceType} (${repair.deviceModel})`,
      });

      return created({
        paymentLinkUrl: paymentLink.url,
        type: "repair",
      });
    }

    return serverError({ error: "Invalid payment type" });
  } catch (error) {
    console.error("[POST /api/payment/create]", error);
    return serverError({ error: "Failed to create payment session" });
  }
}
