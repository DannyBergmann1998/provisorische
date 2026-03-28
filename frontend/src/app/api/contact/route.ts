import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sanitizeString, sanitizeEmail } from "@/lib/sanitize";
import { authLimiter } from "@/lib/rate-limit";
import { sendEmail } from "@/lib/email";
import { badRequest, created, serverError } from "@/lib/utils";

/**
 * Contact Form Schema
 */
const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().min(5).max(200),
  message: z.string().min(10).max(5000),
  phone: z.string().optional(),
});

type ContactRequest = z.infer<typeof contactSchema>;

/**
 * POST /api/contact
 *
 * Submit a contact form
 * Rate limited to prevent spam
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting (shared with auth limiter to prevent abuse)
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const rateLimitResult = authLimiter.check(ip);

    if (!rateLimitResult.success) {
      return new NextResponse("Too many requests", {
        status: 429,
        headers: {
          "Retry-After": rateLimitResult.resetTime.toString(),
        },
      });
    }

    // Parse body
    const body = await request.json().catch(() => ({}));

    // Validate
    const validation = contactSchema.safeParse(body);
    if (!validation.success) {
      return badRequest({
        error: "Invalid contact form data",
        details: validation.error.flatten(),
      });
    }

    // Sanitize inputs (XSS protection)
    const sanitized = {
      name: sanitizeString(validation.data.name),
      email: sanitizeEmail(validation.data.email),
      subject: sanitizeString(validation.data.subject),
      message: sanitizeString(validation.data.message),
      phone: validation.data.phone ? sanitizeString(validation.data.phone) : undefined,
    };

    // Send email to admin
    try {
      await sendEmail({
        to: process.env.EMAIL_FROM || "noreply@handyundpcservice.de",
        subject: `Neue Kontaktanfrage: ${sanitized.subject}`,
        html: `
          <h2>Neue Kontaktanfrage</h2>
          <p><strong>Name:</strong> ${sanitized.name}</p>
          <p><strong>Email:</strong> ${sanitized.email}</p>
          ${sanitized.phone ? `<p><strong>Telefon:</strong> ${sanitized.phone}</p>` : ""}
          <p><strong>Betreff:</strong> ${sanitized.subject}</p>
          <hr />
          <p><strong>Nachricht:</strong></p>
          <p>${sanitized.message.replace(/\n/g, "<br>")}</p>
        `,
      });

      // Send confirmation to user
      await sendEmail({
        to: sanitized.email,
        subject: "Wir haben deine Anfrage erhalten - Handy & PC Service",
        html: `
          <h2>Danke für deine Kontaktanfrage, ${sanitized.name}!</h2>
          <p>Wir haben deine Nachricht erhalten und werden uns so schnell wie möglich bei dir melden.</p>
          <p>Deine Anfrage:</p>
          <hr />
          <p><strong>Betreff:</strong> ${sanitized.subject}</p>
          <p>${sanitized.message.replace(/\n/g, "<br>")}</p>
          <hr />
          <p>Mit freundlichen Grüßen,<br>Das Team von Handy & PC Service</p>
        `,
      });
    } catch (emailError) {
      console.error("[Contact Form] Email sending failed:", emailError);
      // Don't fail the API response if email fails - form was valid
    }

    return created({
      success: true,
      message: "Danke für deine Anfrage! Wir melden uns bald.",
    });
  } catch (error) {
    console.error("[POST /api/contact]", error);
    return serverError({ error: "Failed to process contact form" });
  }
}
