import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
  typescript: true,
});

// ─── CHECKOUT SESSIONS ─────────────────────────────────────────────────────

export async function createCheckoutSession(params: {
  items: Array<{ name: string; price: number; quantity: number; image?: string }>;
  orderId: string;
  userId: string;
  customerEmail: string;
  successUrl: string;
  cancelUrl: string;
  shippingCost?: number;
}) {
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = params.items.map((item) => ({
    price_data: {
      currency: "eur",
      product_data: {
        name: item.name,
        images: item.image ? [item.image] : [],
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }));

  if (params.shippingCost && params.shippingCost > 0) {
    lineItems.push({
      price_data: {
        currency: "eur",
        product_data: { name: "Versand" },
        unit_amount: Math.round(params.shippingCost * 100),
      },
      quantity: 1,
    });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card", "paypal", "sepa_debit", "ideal", "bancontact", "eps", "giropay"],
    line_items: lineItems,
    mode: "payment",
    customer_email: params.customerEmail,
    metadata: {
      orderId: params.orderId,
      userId: params.userId,
    },
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    locale: "de",
    payment_intent_data: {
      metadata: { orderId: params.orderId },
    },
  });

  return session;
}

// ─── REPAIR PAYMENT LINKS ──────────────────────────────────────────────────

/**
 * Create a Stripe Payment Link for repair payments
 * Customer receives this link via email and can pay without checkout flow
 */
export async function createRepairPaymentLink(params: {
  repairId: string;
  userId: string;
  customerEmail: string;
  amount: number;
  description: string;
  successUrl: string;
}) {
  // Create line item
  const lineItem: Stripe.PaymentLinkCreateParams.LineItem = {
    price_data: {
      currency: "eur",
      product_data: {
        name: `Reparatur: ${params.description}`,
        description: `Reparatur-ID: ${params.repairId}`,
      },
      unit_amount: Math.round(params.amount * 100),
    },
    quantity: 1,
  };

  const paymentLink = await stripe.paymentLinks.create({
    line_items: [lineItem],
    metadata: {
      repairId: params.repairId,
      userId: params.userId,
    },
    payment_intent_data: {
      metadata: {
        repairId: params.repairId,
        userId: params.userId,
        type: "repair",
      },
    },
    after_completion: {
      type: "redirect",
      redirect: {
        url: params.successUrl,
      },
    },
  });

  return paymentLink;
}

// ─── WEBHOOK HANDLING ──────────────────────────────────────────────────────

export async function constructWebhookEvent(body: string, signature: string) {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error("STRIPE_WEBHOOK_SECRET not configured");
  }

  return stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  );
}

// ─── HELPER: Get session details ───────────────────────────────────────────

export async function getCheckoutSession(sessionId: string) {
  return stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["payment_intent"],
  });
}

export async function getPaymentLink(linkId: string) {
  return stripe.paymentLinks.retrieve(linkId);
}
