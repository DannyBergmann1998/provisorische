import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { generateInvoicePDF, COMPANY_INFO } from "@/lib/pdf";
import { notFound, serverError } from "@/lib/utils";
import { formatDate } from "@/lib/utils";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const invoice = await db.invoice.findUnique({
      where: { id: params.id },
      include: {
        user:   { select: { name: true, email: true, address: true } },
        order: {
          include: {
            items: { include: { product: { select: { name: true } } } },
          },
        },
        repair: { select: { deviceModel: true, issue: true, finalPrice: true } },
      },
    });

    if (!invoice) return notFound("Rechnung nicht gefunden.");

    // Build line items
    const items: Array<{ description: string; quantity: number; unitPrice: number; total: number }> = [];

    if (invoice.order) {
      for (const item of invoice.order.items) {
        const unitPrice = Number(item.price);
        items.push({
          description: item.product.name,
          quantity:    item.quantity,
          unitPrice,
          total:       unitPrice * item.quantity,
        });
      }
      if (Number(invoice.order.shippingCost) > 0) {
        items.push({
          description: "Versand",
          quantity:    1,
          unitPrice:   Number(invoice.order.shippingCost),
          total:       Number(invoice.order.shippingCost),
        });
      }
    } else if (invoice.repair) {
      const price = Number(invoice.repair.finalPrice ?? 0);
      items.push({
        description: `Reparatur: ${invoice.repair.deviceModel} – ${invoice.repair.issue}`,
        quantity:    1,
        unitPrice:   price,
        total:       price,
      });
    }

    const gross    = Number(invoice.amount);
    const tax      = gross - gross / 1.19;
    const subtotal = gross / 1.19;

    const userAddress = invoice.user.address as Record<string, string> | null;

    const pdfBuffer = await generateInvoicePDF({
      number:   invoice.number,
      date:     formatDate(invoice.createdAt),
      dueDate:  invoice.dueDate ? formatDate(invoice.dueDate) : undefined,
      company:  COMPANY_INFO,
      customer: {
        name:    invoice.user.name ?? "Kunde",
        address: userAddress
          ? `${userAddress.street}, ${userAddress.postalCode} ${userAddress.city}`
          : undefined,
        email:   invoice.user.email,
      },
      items,
      subtotal: Math.round(subtotal * 100) / 100,
      tax:      Math.round(tax * 100) / 100,
      total:    gross,
    });

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type":        "application/pdf",
        "Content-Disposition": `attachment; filename="Rechnung-${invoice.number}.pdf"`,
        "Content-Length":      String(pdfBuffer.byteLength),
      },
    });
  } catch (error) {
    console.error("[INVOICE_PDF]", error);
    return serverError();
  }
}
