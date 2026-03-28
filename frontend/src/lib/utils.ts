import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { nanoid } from "nanoid";
import { db } from "./db";

// ─── Tailwind ─────────────────────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Format helpers ───────────────────────────────────────────────────────────

export function formatPrice(amount: number | string, currency = "EUR"): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency,
  }).format(Number(amount));
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("de-DE", {
    day:   "2-digit",
    month: "2-digit",
    year:  "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat("de-DE", {
    day:    "2-digit",
    month:  "2-digit",
    year:   "numeric",
    hour:   "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

// ─── Token generators ─────────────────────────────────────────────────────────

export function generateSecureToken(size = 48): string {
  return nanoid(size);
}

export async function generateInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await db.invoice.count({
    where: {
      createdAt: {
        gte: new Date(`${year}-01-01`),
        lt:  new Date(`${year + 1}-01-01`),
      },
    },
  });
  return `RE-${year}-${String(count + 1).padStart(4, "0")}`;
}

// ─── API response helpers ─────────────────────────────────────────────────────

export function ok<T>(data: T, status = 200) {
  return Response.json({ success: true, data }, { status });
}

export function created<T>(data: T) {
  return Response.json({ success: true, data }, { status: 201 });
}

export function badRequest(error: string, errors?: Record<string, string[]>) {
  return Response.json({ success: false, error, errors }, { status: 400 });
}

export function unauthorized(error = "Nicht autorisiert") {
  return Response.json({ success: false, error }, { status: 401 });
}

export function forbidden(error = "Zugriff verweigert") {
  return Response.json({ success: false, error }, { status: 403 });
}

export function notFound(error = "Nicht gefunden") {
  return Response.json({ success: false, error }, { status: 404 });
}

export function conflict(error: string) {
  return Response.json({ success: false, error }, { status: 409 });
}

export function serverError(error = "Interner Serverfehler") {
  return Response.json({ success: false, error }, { status: 500 });
}

// ─── Misc ─────────────────────────────────────────────────────────────────────

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[äöüß]/g, (c) => ({ ä: "ae", ö: "oe", ü: "ue", ß: "ss" }[c] ?? c))
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function paginate(page: number, limit: number) {
  return {
    skip: (page - 1) * limit,
    take: limit,
  };
}
