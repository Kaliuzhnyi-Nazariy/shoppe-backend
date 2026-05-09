import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";

const PRODUCTS = [
  {
    title: "Logitech MX Master 3S",
    description:
      "Advanced wireless productivity mouse with ultra-fast scrolling.",
    price: 99.99,
    additionalInformation: "Compatible with Windows and macOS.",
    amount: 18,
    isArchived: false,
    photos: [
      {
        id: "mx-master-3s-1",
        link: "https://images.unsplash.com/photo-1527814050087-3793815479db",
      },
    ],
  },

  {
    title: "Keychron K2 Mechanical Keyboard",
    description: "Compact wireless mechanical keyboard with RGB lighting.",
    price: 89.5,
    additionalInformation: "75% layout with Bluetooth support.",
    amount: 10,
    isArchived: false,
    photos: [
      {
        id: "keychron-k2-1",
        link: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae",
      },
    ],
  },
];

const seedUsers = async () => {
  const hashedPassword = await bcrypt.hash("Password1", 10);

  await prisma.user.upsert({
    where: {
      email: "admin@email.com",
    },
    update: {},
    create: {
      displayName: "admin",
      email: "admin@email.com",
      firstName: "Admin",
      lastName: "User",
      password: hashedPassword,
      role: "admin",
    },
  });

  await prisma.user.upsert({
    where: {
      email: "user@email.com",
    },
    update: {},
    create: {
      displayName: "user",
      email: "user@email.com",
      firstName: "Regular",
      lastName: "User",
      password: hashedPassword,
      role: "customer",
    },
  });

  console.log("Users seeded");
};

const seedProducts = async () => {
  for (const product of PRODUCTS) {
    await prisma.product.upsert({
      where: {
        title: product.title,
      },

      update: {},

      create: {
        title: product.title,
        description: product.description,
        price: product.price,
        additionalInformation: product.additionalInformation,
        amount: product.amount,
        isArchived: product.isArchived,

        photos: {
          create: product.photos,
        },
      },
    });
  }

  console.log("Products seeded");
};

const main = async () => {
  try {
    await seedUsers();
    await seedProducts();

    console.log("Database seeded successfully");
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
};

main();
