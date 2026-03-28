import { z } from "zod";

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

export type RepairRequestInput  = z.infer<typeof repairRequestSchema>;
export type BuybackRequestInput = z.infer<typeof buybackRequestSchema>;
