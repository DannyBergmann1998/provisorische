import { PrismaClient, Role } from "@prisma/client";
import * as argon2 from "argon2";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create super admin
  const adminPassword = await argon2.hash(
    process.env.ADMIN_SEED_PASSWORD || "Admin!2024Secure",
    { type: argon2.argon2id, memoryCost: 65536, timeCost: 3, parallelism: 4 }
  );

  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_SEED_EMAIL || "admin@handyundpcservice.de" },
    update: {},
    create: {
      email: process.env.ADMIN_SEED_EMAIL || "admin@handyundpcservice.de",
      password: adminPassword,
      name: "Admin",
      role: Role.SUPERADMIN,
      emailVerified: true,
    },
  });
  console.log("Admin created:", admin.email);

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "smartphones" },
      update: {},
      create: { name: "Smartphones", slug: "smartphones", description: "Gebrauchte & generalüberholte Smartphones" },
    }),
    prisma.category.upsert({
      where: { slug: "zubehoer" },
      update: {},
      create: { name: "Zubehör", slug: "zubehoer", description: "Handy-Zubehör & Accessoires" },
    }),
    prisma.category.upsert({
      where: { slug: "ersatzteile" },
      update: {},
      create: { name: "Ersatzteile", slug: "ersatzteile", description: "Originale & kompatible Ersatzteile" },
    }),
  ]);
  console.log("Categories created:", categories.map((c) => c.name));

  // Create sample products
  const products = await Promise.all([
    prisma.product.upsert({
      where: { slug: "iphone-13-generalueberholt" },
      update: {},
      create: {
        name: "iPhone 13 (Generalüberholt)",
        slug: "iphone-13-generalueberholt",
        description: "Apple iPhone 13 in sehr gutem Zustand. Vollständig geprüft und gereinigt. 12 Monate Garantie.",
        price: 499.99,
        compareAt: 649.00,
        stock: 5,
        sku: "IP13-128-GEN",
        categoryId: categories[0].id,
        images: ["/images/products/iphone-13.jpg"],
        published: true,
        featured: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: "samsung-galaxy-s23-generalueberholt" },
      update: {},
      create: {
        name: "Samsung Galaxy S23 (Generalüberholt)",
        slug: "samsung-galaxy-s23-generalueberholt",
        description: "Samsung Galaxy S23 in sehr gutem Zustand. Komplett geprüft. 12 Monate Garantie.",
        price: 449.99,
        compareAt: 599.00,
        stock: 3,
        sku: "SGS23-128-GEN",
        categoryId: categories[0].id,
        images: ["/images/products/samsung-s23.jpg"],
        published: true,
        featured: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: "displayschutzglas-iphone-14" },
      update: {},
      create: {
        name: "Panzerglas iPhone 14 (2er-Pack)",
        slug: "displayschutzglas-iphone-14",
        description: "Gehärtetes Displayschutzglas für iPhone 14. 9H Härte, vollflächig.",
        price: 12.99,
        stock: 50,
        sku: "PANZERGLAS-IP14-2PK",
        categoryId: categories[1].id,
        images: ["/images/products/panzerglas.jpg"],
        published: true,
      },
    }),
  ]);
  console.log("Products created:", products.map((p) => p.name));

  console.log("Seeding complete!");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
