import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { ok, badRequest, unauthorized, serverError, notFound } from "@/lib/utils";

/**
 * POST /api/buybacks/[id]/initiate-payment
 * Admin accepts a buyback and initiates payment (SEPA transfer)
 * Customer must provide IBAN for payment
 */

const paymentSchema = z.object({
  iban: z
    .string()
    .min(15, "IBAN zu kurz")
    .max(34, "IBAN zu lang")
    .regex(/^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/, "Ungültige IBAN"),
  accountHolder: z.string().min(2, "Name erforderlich").max(100),
  amount: z.number().min(1, "Betrag erforderlich"),
});

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = req.headers.get("x-user-id");
  const userRole = req.headers.get("x-user-role");

  // Only admin can initiate payments
  if (!userId || !["ADMIN", "SUPERADMIN"].includes(userRole || "")) {
    return unauthorized();
  }

  try {
    const buybackId = params.id;
    const body = await req.json();

    // Validate payment details
    const result = paymentSchema.safeParse(body);
    if (!result.success) {
      return badRequest("Validierungsfehler", result.error.flatten().fieldErrors as Record<string, string[]>);
    }

    const { iban, accountHolder, amount } = result.data;

    // Fetch buyback
    const buyback = await db.buyback.findUnique({
      where: { id: buybackId },
      include: { user: true },
    });

    if (!buyback) {
      return notFound("Ankauf nicht gefunden");
    }

    // Validate payment can be initiated
    if (buyback.status !== "ACCEPTED") {
      return badRequest("Dieses Gerät wurde nicht akzeptiert");
    }

    if (!buyback.finalPrice) {
      return badRequest("Finaler Preis nicht festgelegt");
    }

    // Validate amount matches final price
    if (Math.abs(amount - Number(buyback.finalPrice)) > 0.01) {
      return badRequest("Betrag stimmt nicht mit finalem Preis überein");
    }

    // Store SEPA transfer details (in production, use encrypted storage)
    // This is a simplified example - in production, use a proper payment service
    const transferRecord = {
      id: `sepa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      buybackId,
      iban: iban, // In production: encrypt this
      accountHolder,
      amount,
      status: "PENDING",
      createdAt: new Date(),
      scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000), // Schedule for next day
    };

    // Update buyback status to indicate payment in progress
    const updatedBuyback = await db.buyback.update({
      where: { id: buybackId },
      data: {
        status: "COMPLETED", // Mark as completed when payment initiated
        adminNotes: (buyback.adminNotes || "") +
          `\n\n[SEPA Payment Initiated]\n` +
          `Amount: €${amount.toFixed(2)}\n` +
          `Scheduled: ${transferRecord.scheduledFor.toLocaleString("de-DE")}\n` +
          `Transfer ID: ${transferRecord.id}`,
      },
    });

    console.log("[SEPA_TRANSFER_INITIATED]", {
      buybackId,
      transferId: transferRecord.id,
      amount,
      accountHolder,
      customer: buyback.user.email,
      timestamp: new Date().toISOString(),
    });

    // In production, integrate with your SEPA provider
    // Examples: Stripe Payouts, Wise, GoCardless, or your bank's API

    return ok({
      transferId: transferRecord.id,
      status: "PENDING",
      amount,
      scheduledFor: transferRecord.scheduledFor,
      message: "Überweisung ist eingeplant. Der Betrag wird innerhalb von 1-2 Werktagen überwiesen.",
    });
  } catch (error) {
    console.error("[SEPA_PAYMENT_ERROR]", error);
    return serverError();
  }
}
