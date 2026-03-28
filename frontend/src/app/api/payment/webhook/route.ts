import { NextRequest, NextResponse } from "next/server";
import { constructWebhookEvent } from "@/lib/stripe";
import { db } from "@/lib/db";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { serverError } from "@/lib/utils";

/**
 * POST /api/payment/webhook
 *
 * Stripe webhook handler for payment events
 * This endpoint is called by Stripe when payment events occur
 *
 * Events handled:
 * - checkout.session.completed: Order paid, mark as PAID
 * - payment_intent.succeeded: Generic payment success
 * - payment_intent.payment_failed: Payment failed
 * - charge.refunded: Order refunded
 *
 * IMPORTANT: This must be configured in Stripe Dashboard as a webhook endpoint
 * URL: https://yourdomain.com/api/payment/webhook
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return new NextResponse("Missing stripe-signature header", { status: 400 });
    }

    // Verify Stripe signature and construct event
    const event = await constructWebhookEvent(body, signature);

    if (!event) {
      return new NextResponse("Invalid signature", { status: 400 });
    }

    // Handle checkout.session.completed
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;
      const orderId = session.metadata?.orderId;
      const userId = session.metadata?.userId;

      if (!orderId || !userId) {
        console.warn("[Webhook] Missing orderId or userId in metadata");
        return NextResponse.json({ success: false });
      }

      // Update order status to PAID
      const order = await db.order.update({
        where: { id: orderId },
        data: { status: "PAID" },
        include: {
          user: true,
          items: { include: { product: true } },
        },
      });

      // Decrement product stock
      for (const item of order.items) {
        await db.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Create payment record
      await db.payment.upsert({
        where: { orderId: order.id },
        update: { status: "COMPLETED" },
        create: {
          orderId: order.id,
          stripeId: session.payment_intent,
          amount: (session.amount_total ?? 0) / 100,
          currency: session.currency?.toUpperCase() || "EUR",
          status: "COMPLETED",
        },
      });

      // Generate invoice
      const invoiceNumber = `INV-${Date.now()}`;
      await db.invoice.create({
        data: {
          userId: order.userId,
          orderId: order.id,
          number: invoiceNumber,
          amount: order.totalAmount,
          dueDate: new Date(),
          paid: true,
        },
      });

      // Send confirmation email
      try {
        await sendOrderConfirmationEmail(
          order.user.email,
          order.user.name || "Customer",
          order.id,
          order.totalAmount
        );
      } catch (emailError) {
        console.error("[Webhook] Failed to send confirmation email:", emailError);
        // Don't fail the webhook if email fails
      }

      console.log(`[Webhook] Order ${orderId} marked as PAID`);
      return NextResponse.json({ success: true, orderId });
    }

    // Handle payment_intent.succeeded (for repair payments)
    if (event.type === "payment_intent.succeeded") {
      const intent = event.data.object as any;
      const repairId = intent.metadata?.repairId;

      if (repairId) {
        const repair = await db.repair.update({
          where: { id: repairId },
          data: { status: "DONE" },
          include: { user: true },
        });

        // Create payment record
        await db.payment.create({
          data: {
            stripeId: intent.id,
            amount: (intent.amount ?? 0) / 100,
            currency: intent.currency?.toUpperCase() || "EUR",
            status: "COMPLETED",
          },
        });

        console.log(`[Webhook] Repair ${repairId} payment succeeded`);
      }

      return NextResponse.json({ success: true });
    }

    // Handle payment_intent.payment_failed
    if (event.type === "payment_intent.payment_failed") {
      const intent = event.data.object as any;
      const orderId = intent.metadata?.orderId;
      const repairId = intent.metadata?.repairId;

      if (orderId) {
        await db.order.update({
          where: { id: orderId },
          data: { status: "CANCELLED" },
        });
        console.log(`[Webhook] Order ${orderId} payment failed`);
      }

      if (repairId) {
        console.log(`[Webhook] Repair ${repairId} payment failed`);
      }

      return NextResponse.json({ success: true });
    }

    // Handle charge.refunded
    if (event.type === "charge.refunded") {
      const charge = event.data.object as any;

      if (charge.payment_intent) {
        const payment = await db.payment.findUnique({
          where: { stripeId: charge.payment_intent },
          include: { order: true },
        });

        if (payment?.order) {
          await db.order.update({
            where: { id: payment.orderId },
            data: { status: "REFUNDED" },
          });

          // Restore product stock
          const order = await db.order.findUnique({
            where: { id: payment.orderId },
            include: { items: true },
          });

          if (order) {
            for (const item of order.items) {
              await db.product.update({
                where: { id: item.productId },
                data: { stock: { increment: item.quantity } },
              });
            }
          }

          console.log(`[Webhook] Order ${payment.orderId} refunded`);
        }
      }

      return NextResponse.json({ success: true });
    }

    // Unhandled event type
    console.warn(`[Webhook] Unhandled event type: ${event.type}`);
    return NextResponse.json({ success: false, message: "Unhandled event type" });
  } catch (error) {
    console.error("[POST /api/payment/webhook]", error);
    return serverError({ error: "Webhook processing failed" });
  }
}

/**
 * Webhook setup instructions:
 *
 * 1. Go to Stripe Dashboard → Developers → Webhooks
 * 2. Add endpoint: https://yourdomain.com/api/payment/webhook
 * 3. Select events to listen for:
 *    - checkout.session.completed
 *    - payment_intent.succeeded
 *    - payment_intent.payment_failed
 *    - charge.refunded
 * 4. Copy the webhook signing secret to STRIPE_WEBHOOK_SECRET in .env
 *
 * For local testing:
 * npm install -g stripe
 * stripe listen --forward-to localhost:3000/api/payment/webhook
 * stripe trigger checkout.session.completed
 */
