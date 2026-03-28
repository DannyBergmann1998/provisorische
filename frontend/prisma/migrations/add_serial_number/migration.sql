-- Add serialNumber field to Buyback table
ALTER TABLE "Buyback" ADD COLUMN "serialNumber" TEXT NOT NULL DEFAULT '';

-- Create index for serial number lookups
CREATE INDEX "Buyback_serialNumber_idx" ON "Buyback"("serialNumber");

-- Update existing records with a placeholder value
UPDATE "Buyback" SET "serialNumber" = 'MIGRATED_' || "id" WHERE "serialNumber" = '';
