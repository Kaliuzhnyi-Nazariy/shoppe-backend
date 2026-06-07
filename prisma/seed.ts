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
    categoris: ["ELECTRONICS", "GAMING"],
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
    categoris: ["ELECTRONICS", "GAMING"],
  },
  {
    title: "Apple Studio Display",
    description:
      "27-inch 5K Retina display with outstanding color accuracy and premium aluminum design.",
    price: 1599.99,
    additionalInformation:
      "Includes built-in camera, studio-quality microphones, and six-speaker sound system.",
    amount: 6,
    isArchived: false,
    photos: [
      {
        id: "studio-display-1",
        link: "https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc",
      },
      {
        id: "studio-display-2",
        link: "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931",
      },
      {
        id: "studio-display-3",
        link: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
      },
    ],
    categoris: ["ELECTRONICS", "HOME"],
  },
  {
    title: "SteelSeries Arctis Nova Pro",
    description:
      "Premium wireless gaming headset with active noise cancellation and immersive spatial audio.",
    price: 329.99,
    additionalInformation:
      "Dual-battery hot swap system with multi-platform support.",
    amount: 0,
    isArchived: false,
    photos: [
      {
        id: "arctis-nova-pro-1",
        link: "https://images.unsplash.com/photo-1546435770-a3e426bf472b",
      },
    ],
    categoris: ["ELECTRONICS", "OTHER"],
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
      isPasswordSet: true,
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
      isPasswordSet: true,
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
