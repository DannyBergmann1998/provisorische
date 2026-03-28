import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { createRepairPaymentLink } from "@/lib/stripe";
import { ok, badRequest, unauthorized, serverError, notFound } from "@/lib/utils";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

/**
 * POST /api/repairs/[id]/create-payment-link
 * Admin creates a payment link for a completed repair
 * Sends the link to customer via email
 */
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = req.headers.get("x-user-id");
  const userRole = req.headers.get("x-user-role");

  // Only admin/technician can create payment links
  if (!userId || !["ADMIN", "TECHNICIAN", "SUPERADMIN"].includes(userRole || "")) {
    return unauthorized();
  }

  try {
    const repairId = params.id;

    // Fetch repair
    const repair = await db.repair.findUnique({
      where: { id: repairId },
      include: { user: true },
    });

    if (!repair) {
      return notFound("Reparatur nicht gefunden");
    }

    // Validate repair can be paid
    if (repair.status !== "DONE") {
      return badRequest("Diese Reparatur ist nicht bereit zur Zahlung");
    }

    if (!repair.finalPrice) {
      return badRequest("Endpreis wurde noch nicht festgelegt");
    }

    // Check if payment link already exists
    if (repair.trackingNumber && repair.trackingNumber.startsWith("stripe_")) {
      return badRequest("Zahlungslink existiert bereits");
    }

    // Create payment link
    const paymentLink = await createRepairPaymentLink({
      repairId,
      userId: repair.userId,
      customerEmail: repair.user.email,
      amount: Number(repair.finalPrice),
      description: repair.issue,
      successUrl: `${APP_URL}/repairs/${repairId}/payment-success`,
    });

    // Store payment link reference
    await db.repair.update({
      where: { id: repairId },
      data: {
        trackingNumber: `stripe_${paymentLink.id}`,
      },
    });

    console.log("[REPAIR_PAYMENT_LINK_CREATED]", {
      repairId,
      paymentLinkId: paymentLink.id,
      amount: repair.finalPrice,
      customer: repair.user.email,
      timestamp: new Date().toISOString(),
    });

    return ok({
      paymentLinkId: paymentLink.id,
      url: paymentLink.url,
      amount: Number(repair.finalPrice),
    });
  } catch (error) {
    console.error("[REPAIR_PAYMENT_LINK_ERROR]", error);
    return serverError();
  }
}
