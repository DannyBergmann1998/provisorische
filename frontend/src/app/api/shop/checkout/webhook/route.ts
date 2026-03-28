import { NextRequest } from "next/server";
import { constructWebhookEvent } from "@/lib/stripe";
import { db } from "@/lib/db";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { generateInvoiceNumber } from "@/lib/utils";
import type Stripe from "stripe";

/**
 * POST /api/shop/checkout/webhook
 * Stripe webhook handler for:
 * - Shop orders (checkout.session.completed)
 * - Repair payments (payment_intent.succeeded)
 * - Failed payments
 */
export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    console.error("[WEBHOOK] No signature provided");
    return Response.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = await constructWebhookEvent(body, signature);
  } catch (err) {
    console.error("[WEBHOOK] Signature verification failed:", err);
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      // ─── SHOP ORDER PAYMENT ───────────────────────────────────────────

      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;
        const userId = session.metadata?.userId;

        if (!orderId || !userId) {
          console.warn("[WEBHOOK] Missing orderId or userId in metadata", { orderId, userId });
          break;
        }

        const order = await db.order.update({
          where: { id: orderId },
          data: { status: "PAID" },
          include: {
            user: { select: { name: true, email: true } },
            items: { include: { product: true } },
          },
        });

        // Decrease stock
        for (const item of order.items) {
          await db.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }

        // Create payment record
        if (session.payment_intent) {
          await db.payment.upsert({
            where: { stripeId: String(session.payment_intent) },
            update: { status: "paid" },
            create: {
              orderId,
              stripeId: String(session.payment_intent),
              amount: (session.amount_total ?? 0) / 100,
              currency: session.currency ?? "eur",
              status: "paid",
            },
          });
        }

        // Generate invoice
        const invoiceNumber = await generateInvoiceNumber();
        await db.invoice.create({
          data: {
            userId,
            orderId,
            number: invoiceNumber,
            amount: (session.amount_total ?? 0) / 100,
            paid: true,
          },
        });

        // Send confirmation email
        await sendOrderConfirmationEmail(
          order.user.email,
          order.user.name ?? "Kunde",
          orderId,
          (session.amount_total ?? 0) / 100
        ).catch(console.error);

        console.log("[WEBHOOK_SHOP_ORDER_PAID]", {
          orderId,
          amount: (session.amount_total ?? 0) / 100,
          customer: order.user.email,
          timestamp: new Date().toISOString(),
        });

        break;
      }

      // ─── REPAIR PAYMENT (Payment Link) ────────────────────────────────

      case "payment_intent.succeeded": {
        const intent = event.data.object as Stripe.PaymentIntent;
        const repairId = intent.metadata?.repairId;
        const paymentType = intent.metadata?.type;

        if (!repairId || paymentType !== "repair") break;

        const repair = await db.repair.update({
          where: { id: repairId },
          data: { status: "DONE" }, // Already marked as DONE, but confirm payment
          include: { user: true },
        });

        // Create payment record
        await db.payment.upsert({
          where: { stripeId: intent.id },
          update: { status: "paid" },
          create: {
            repairId,
            stripeId: intent.id,
            amount: (intent.amount ?? 0) / 100,
            currency: intent.currency ?? "eur",
            status: "paid",
          },
        });

        console.log("[WEBHOOK_REPAIR_PAID]", {
          repairId,
          amount: (intent.amount ?? 0) / 100,
          customer: repair.user.email,
          timestamp: new Date().toISOString(),
        });

        break;
      }

      // ─── FAILED PAYMENTS ──────────────────────────────────────────────

      case "payment_intent.payment_failed": {
        const intent = event.data.object as Stripe.PaymentIntent;
        const orderId = intent.metadata?.orderId;
        const repairId = intent.metadata?.repairId;

        if (orderId) {
          await db.order.update({
            where: { id: orderId },
            data: { status: "CANCELLED" },
          });

          console.log("[WEBHOOK_PAYMENT_FAILED]", {
            orderId,
            reason: intent.last_payment_error?.message,
            timestamp: new Date().toISOString(),
          });
        } else if (repairId) {
          // Log failed repair payment but don't change status
          console.log("[WEBHOOK_REPAIR_PAYMENT_FAILED]", {
            repairId,
            reason: intent.last_payment_error?.message,
            timestamp: new Date().toISOString(),
          });
        }

        break;
      }

      // ─── CHARGE REFUNDED ──────────────────────────────────────────────

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;

        if (charge.payment_intent) {
          const payment = await db.payment.findUnique({
            where: { stripeId: charge.payment_intent as string },
          });

          if (payment?.orderId) {
            await db.order.update({
              where: { id: payment.orderId },
              data: { status: "REFUNDED" },
            });

            console.log("[WEBHOOK_ORDER_REFUNDED]", {
              orderId: payment.orderId,
              amount: charge.amount / 100,
              timestamp: new Date().toISOString(),
            });
          }
        }

        break;
      }

      default:
        console.log(`[WEBHOOK] Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error("[WEBHOOK] Processing error:", error);
    // Don't fail the webhook request, just log the error
  }

  return Response.json({ received: true });
}
