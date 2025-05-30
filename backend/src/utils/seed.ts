import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { logger } from "./logger";

const prisma = new PrismaClient();

async function seed() {
  try {
    logger.info("🌱 Starting database seed...");

    // Create admin user
    const adminPassword = await bcrypt.hash("admin123", 12);
    const admin = await prisma.user.upsert({
      where: { email: "admin@tribalcrafts.com" },
      update: {},
      create: {
        email: "admin@tribalcrafts.com",
        password: adminPassword,
        firstName: "Admin",
        lastName: "User",
        role: "ADMIN",
      },
    });

    // Create artist user
    const artistPassword = await bcrypt.hash("artist123", 12);
    const artistUser = await prisma.user.upsert({
      where: { email: "artist@tribalcrafts.com" },
      update: {},
      create: {
        email: "artist@tribalcrafts.com",
        password: artistPassword,
        firstName: "Maya",
        lastName: "Patel",
        role: "ARTIST",
      },
    });

    // Create artist profile
    const artist = await prisma.artist.upsert({
      where: { userId: artistUser.id },
      update: {},
      create: {
        userId: artistUser.id,
        bio: "Traditional craftsperson specializing in handwoven textiles and pottery.",
        specialty: "Textiles & Pottery",
        experience: 15,
        location: "Rajasthan, India",
        website: "https://mayacrafts.com",
        isVerified: true,
      },
    });

    // Create categories
    const categories = await Promise.all([
      prisma.category.upsert({
        where: { name: "Textiles" },
        update: {},
        create: {
          name: "Textiles",
          slug: "textiles",
          description: "Handwoven fabrics, rugs, and traditional clothing",
          image: "/placeholder.svg?height=300&width=400",
        },
      }),
      prisma.category.upsert({
        where: { name: "Pottery" },
        update: {},
        create: {
          name: "Pottery",
          slug: "pottery",
          description: "Handcrafted ceramics and earthenware",
          image: "/placeholder.svg?height=300&width=400",
        },
      }),
      prisma.category.upsert({
        where: { name: "Jewelry" },
        update: {},
        create: {
          name: "Jewelry",
          slug: "jewelry",
          description: "Traditional and contemporary jewelry pieces",
          image: "/placeholder.svg?height=300&width=400",
        },
      }),
      prisma.category.upsert({
        where: { name: "Wood Crafts" },
        update: {},
        create: {
          name: "Wood Crafts",
          slug: "wood-crafts",
          description: "Carved wooden items and furniture",
          image: "/placeholder.svg?height=300&width=400",
        },
      }),
    ]);

    // Create sample products
    const products = [
      {
        name: "Handwoven Silk Scarf",
        slug: "handwoven-silk-scarf",
        description: "Beautiful handwoven silk scarf with traditional patterns",
        price: 89.99,
        stock: 25,
        images: ["/placeholder.svg?height=400&width=400"],
        tags: ["silk", "handwoven", "traditional"],
        categoryId: categories[0].id,
        artistId: artist.id,
        status: "PUBLISHED" as const,
      },
      {
        name: "Ceramic Tea Set",
        slug: "ceramic-tea-set",
        description: "Handcrafted ceramic tea set with traditional glazing",
        price: 156.0,
        stock: 12,
        images: ["/placeholder.svg?height=400&width=400"],
        tags: ["ceramic", "tea", "handcrafted"],
        categoryId: categories[1].id,
        artistId: artist.id,
        status: "PUBLISHED" as const,
      },
      {
        name: "Silver Tribal Necklace",
        slug: "silver-tribal-necklace",
        description: "Authentic tribal silver necklace with intricate designs",
        price: 234.5,
        stock: 8,
        images: ["/placeholder.svg?height=400&width=400"],
        tags: ["silver", "tribal", "necklace"],
        categoryId: categories[2].id,
        artistId: artist.id,
        status: "PUBLISHED" as const,
      },
      {
        name: "Carved Wooden Bowl",
        slug: "carved-wooden-bowl",
        description: "Hand-carved wooden bowl made from sustainable wood",
        price: 67.25,
        stock: 18,
        images: ["/placeholder.svg?height=400&width=400"],
        tags: ["wood", "carved", "sustainable"],
        categoryId: categories[3].id,
        artistId: artist.id,
        status: "PUBLISHED" as const,
      },
    ];

    for (const productData of products) {
      await prisma.product.upsert({
        where: { slug: productData.slug },
        update: {},
        create: productData,
      });
    }

    // Create customer user
    const customerPassword = await bcrypt.hash("customer123", 12);
    const customer = await prisma.user.upsert({
      where: { email: "customer@example.com" },
      update: {},
      create: {
        email: "customer@example.com",
        password: customerPassword,
        firstName: "John",
        lastName: "Doe",
        role: "CUSTOMER",
      },
    });

    logger.info("✅ Database seeded successfully!");
    logger.info("👤 Admin: admin@tribalcrafts.com / admin123");
    logger.info("🎨 Artist: artist@tribalcrafts.com / artist123");
    logger.info("🛒 Customer: customer@example.com / customer123");
  } catch (error) {
    logger.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed();
