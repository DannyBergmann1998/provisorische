import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { createCheckoutSession } from "@/lib/stripe";
import { checkoutSchema } from "@/lib/validations";
import { ok, badRequest, unauthorized, serverError } from "@/lib/utils";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const SHIPPING_COST = 4.99;
const FREE_SHIPPING_THRESHOLD = 49;

export async function POST(req: NextRequest) {
  const userId    = req.headers.get("x-user-id");
  const userEmail = req.headers.get("x-user-email");
  if (!userId || !userEmail) return unauthorized();

  try {
    const body = await req.json();
    const result = checkoutSchema.safeParse(body);
    if (!result.success) {
      return badRequest("Validierungsfehler", result.error.flatten().fieldErrors as Record<string, string[]>);
    }

    const { items, shippingAddress, notes } = result.data;

    // Fetch products and validate stock
    const productIds = items.map((i) => i.productId);
    const products = await db.product.findMany({
      where: { id: { in: productIds }, published: true },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));
    const errors: string[] = [];

    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) {
        errors.push(`Produkt ${item.productId} nicht gefunden.`);
        continue;
      }
      if (product.stock < item.quantity) {
        errors.push(`${product.name}: Nur noch ${product.stock} auf Lager.`);
      }
    }

    if (errors.length > 0) return badRequest(errors.join(" "));

    // Calculate totals
    const subtotal = items.reduce((sum, item) => {
      const product = productMap.get(item.productId)!;
      return sum + Number(product.price) * item.quantity;
    }, 0);

    const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const totalAmount  = subtotal + shippingCost;

    // Create order
    const order = await db.order.create({
      data: {
        userId,
        totalAmount,
        shippingCost,
        shippingAddress,
        notes,
        items: {
          create: items.map((item) => {
            const product = productMap.get(item.productId)!;
            return {
              productId: item.productId,
              quantity:  item.quantity,
              price:     product.price,
            };
          }),
        },
      },
    });

    // Create Stripe checkout session
    const session = await createCheckoutSession({
      items: items.map((item) => {
        const product = productMap.get(item.productId)!;
        return {
          name:     product.name,
          price:    Number(product.price),
          quantity: item.quantity,
          image:    product.images[0],
        };
      }),
      orderId:       order.id,
      userId,
      customerEmail: shippingAddress.email || userEmail,
      successUrl:    `${APP_URL}/checkout/success?orderId=${order.id}`,
      cancelUrl:     `${APP_URL}/cart`,
      shippingCost,
    });

    // Save Stripe session ID
    await db.order.update({
      where: { id: order.id },
      data:  { stripeSessionId: session.id },
    });

    return ok({ sessionId: session.id, url: session.url, orderId: order.id });
  } catch (error) {
    console.error("[CHECKOUT]", error);
    return serverError();
  }
}
