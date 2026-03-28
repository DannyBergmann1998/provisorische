import { z } from "zod";

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const registerSchema = z.object({
  name:     z.string().min(2, "Name muss mindestens 2 Zeichen haben").max(100),
  email:    z.string().email("Ungültige E-Mail-Adresse"),
  password: z
    .string()
    .min(8, "Passwort muss mindestens 8 Zeichen haben")
    .regex(/[A-Z]/, "Passwort muss mindestens einen Großbuchstaben enthalten")
    .regex(/[a-z]/, "Passwort muss mindestens einen Kleinbuchstaben enthalten")
    .regex(/[0-9]/, "Passwort muss mindestens eine Ziffer enthalten")
    .regex(/[^A-Za-z0-9]/, "Passwort muss mindestens ein Sonderzeichen enthalten"),
  phone:    z.string().optional(),
});

export const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1, "Passwort ist erforderlich"),
  totp:     z.string().optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Ungültige E-Mail-Adresse"),
});

export const resetPasswordSchema = z.object({
  token:    z.string().min(1),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/[0-9]/)
    .regex(/[^A-Za-z0-9]/),
});

export const updateProfileSchema = z.object({
  name:  z.string().min(2).max(100).optional(),
  phone: z.string().optional(),
  address: z.object({
    street:     z.string(),
    city:       z.string(),
    postalCode: z.string(),
    country:    z.string(),
  }).optional(),
});

// ─── Repair ───────────────────────────────────────────────────────────────────

export const repairRequestSchema = z.object({
  deviceType:  z.enum(["PHONE", "PC", "LAPTOP", "CONSOLE", "TABLET", "OTHER"]),
  deviceModel: z.string().min(2).max(200),
  issue:       z.string().min(2).max(200),
  description: z.string().max(2000).optional(),
  acceptRepairStart: z.boolean().refine(val => val === true, {
    message: "Du musst zustimmen, dass die Reparatur vor Ablauf der Widerrufsfrist begonnen wird.",
  }),
});

export const updateRepairSchema = z.object({
  status:         z.enum(["PENDING", "RECEIVED", "IN_PROGRESS", "WAITING_PARTS", "DONE", "CANCELLED"]).optional(),
  estimatedPrice: z.number().min(0).optional(),
  finalPrice:     z.number().min(0).optional(),
  adminNotes:     z.string().max(2000).optional(),
  trackingNumber: z.string().optional(),
});

// ─── Buyback ──────────────────────────────────────────────────────────────────

export const buybackRequestSchema = z.object({
  deviceType:   z.enum(["PHONE", "PC", "LAPTOP", "CONSOLE", "TABLET", "OTHER"]),
  deviceModel:  z.string().min(2).max(200),
  serialNumber: z
    .string()
    .min(6, "Bitte gib eine gültige Seriennummer oder IMEI ein")
    .max(50)
    .regex(/^[A-Z0-9]+$/, "Bitte gib eine gültige Seriennummer oder IMEI ein"),
  condition:    z.enum(["Wie neu", "Sehr gut", "Gut", "Akzeptabel", "Defekt"]),
  description:  z.string().max(2000).optional(),
});

export const updateBuybackSchema = z.object({
  status:     z.enum(["PENDING", "REVIEWED", "ACCEPTED", "REJECTED", "COMPLETED"]).optional(),
  finalPrice: z.number().min(0).optional(),
  adminNotes: z.string().max(2000).optional(),
});

// ─── Shop ─────────────────────────────────────────────────────────────────────

export const createProductSchema = z.object({
  name:        z.string().min(2).max(300),
  slug:        z.string().regex(/^[a-z0-9-]+$/),
  description: z.string().max(5000).optional(),
  price:       z.number().min(0),
  compareAt:   z.number().min(0).optional(),
  stock:       z.number().int().min(0).default(0),
  sku:         z.string().optional(),
  categoryId:  z.string().optional(),
  images:      z.array(z.string().url()).default([]),
  published:   z.boolean().default(false),
  featured:    z.boolean().default(false),
});

export const checkoutSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    quantity:  z.number().int().min(1),
  })).min(1),
  shippingAddress: z.object({
    firstName:  z.string().min(1),
    lastName:   z.string().min(1),
    email:      z.string().email(),
    phone:      z.string().optional(),
    address:    z.string().min(1),
    city:       z.string().min(1),
    postalCode: z.string().min(4),
    country:    z.string().default("DE"),
  }),
  notes: z.string().max(500).optional(),
});

// ─── Admin ────────────────────────────────────────────────────────────────────

export const paginationSchema = z.object({
  page:   z.coerce.number().int().min(1).default(1),
  limit:  z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  sort:   z.string().optional(),
  order:  z.enum(["asc", "desc"]).default("desc"),
});

export type RegisterInput        = z.infer<typeof registerSchema>;
export type LoginInput            = z.infer<typeof loginSchema>;
export type RepairRequestInput   = z.infer<typeof repairRequestSchema>;
export type BuybackRequestInput  = z.infer<typeof buybackRequestSchema>;
export type CheckoutInput        = z.infer<typeof checkoutSchema>;
export type CreateProductInput   = z.infer<typeof createProductSchema>;
export type PaginationInput      = z.infer<typeof paginationSchema>;
