import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { updateRepairSchema } from "@/lib/validations";
import { sendRepairStatusEmail } from "@/lib/email";
import { ok, badRequest, notFound, serverError, generateInvoiceNumber } from "@/lib/utils";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const result = updateRepairSchema.safeParse(body);
    if (!result.success) {
      return badRequest("Validierungsfehler", result.error.flatten().fieldErrors as Record<string, string[]>);
    }

    const repair = await db.repair.findUnique({
      where: { id: params.id },
      include: { user: { select: { email: true, name: true } } },
    });
    if (!repair) return notFound("Reparaturauftrag nicht gefunden.");

    const updated = await db.repair.update({
      where: { id: params.id },
      data:  result.data,
      include: { user: { select: { email: true, name: true } } },
    });

    // Auto-create invoice when status = DONE and finalPrice is set
    if (result.data.status === "DONE" && updated.finalPrice) {
      const existingInvoice = await db.invoice.findUnique({
        where: { repairId: params.id },
      });
      if (!existingInvoice) {
        const invoiceNumber = await generateInvoiceNumber();
        await db.invoice.create({
          data: {
            userId:   repair.userId,
            repairId: params.id,
            number:   invoiceNumber,
            amount:   updated.finalPrice,
          },
        });
      }
    }

    // Send status update email
    if (result.data.status && result.data.status !== repair.status) {
      sendRepairStatusEmail(
        updated.user.email,
        updated.user.name ?? "Kunde",
        params.id,
        result.data.status,
        result.data.adminNotes
      ).catch(console.error);
    }

    return ok(updated);
  } catch (error) {
    console.error("[ADMIN_REPAIR_PATCH]", error);
    return serverError();
  }
}
