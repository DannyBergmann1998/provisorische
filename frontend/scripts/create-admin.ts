import * as argon2 from "argon2";
import { PrismaClient } from "@prisma/client";
import { nanoid } from "nanoid";

const db = new PrismaClient();

async function createAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@handyundpcservice.de";
  const adminPassword = process.env.ADMIN_PASSWORD || nanoid(16);
  const adminName = process.env.ADMIN_NAME || "Admin";

  try {
    console.log("🔐 Admin-Konto wird erstellt...\n");

    // Check if admin already exists
    const existing = await db.user.findUnique({
      where: { email: adminEmail.toLowerCase() },
    });

    if (existing) {
      console.error(`❌ Admin mit E-Mail "${adminEmail}" existiert bereits!`);
      if (existing.role === "ADMIN" || existing.role === "SUPERADMIN") {
        console.log(`   Rolle: ${existing.role}`);
      }
      process.exit(1);
    }

    // Hash password
    const hashedPassword = await argon2.hash(adminPassword, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
    });

    // Create admin user
    const admin = await db.user.create({
      data: {
        email: adminEmail.toLowerCase(),
        password: hashedPassword,
        name: adminName,
        role: "SUPERADMIN",
        emailVerified: true, // Admin doesn't need email verification
      },
    });

    console.log("✅ Admin-Konto erfolgreich erstellt!\n");
    console.log("📋 Anmeldedaten:");
    console.log("═".repeat(50));
    console.log(`📧 E-Mail:    ${adminEmail}`);
    console.log(`🔑 Passwort:  ${adminPassword}`);
    console.log(`👤 Name:      ${adminName}`);
    console.log(`🎯 Rolle:     SUPERADMIN`);
    console.log("═".repeat(50));
    console.log("\n🔗 Login-URL: /auth/login");
    console.log("📊 Admin-Panel: /admin");
    console.log("\n💾 Diese Daten speichern! Passwort später nicht einsehbar.\n");

  } catch (error) {
    console.error("❌ Fehler beim Erstellen des Admin-Kontos:", error);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

createAdmin();
