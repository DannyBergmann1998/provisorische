import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ok, unauthorized, forbidden, notFound, serverError } from "@/lib/utils";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = req.headers.get("x-user-id");
  const userRole = req.headers.get("x-user-role");
  if (!userId) return unauthorized();

  try {
    const repair = await db.repair.findUnique({
      where: { id: params.id },
      include: {
        uploads: true,
        invoice: { select: { id: true, number: true, pdfUrl: true, amount: true } },
      },
    });

    if (!repair) return notFound("Reparaturauftrag nicht gefunden.");

    // Only the owner or admin can view
    if (repair.userId !== userId && userRole !== "ADMIN" && userRole !== "SUPERADMIN") {
      return forbidden();
    }

    return ok(repair);
  } catch (error) {
    console.error("[REPAIR_GET]", error);
    return serverError();
  }
}
