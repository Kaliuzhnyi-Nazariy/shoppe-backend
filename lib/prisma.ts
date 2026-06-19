import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import { errorHandler } from "../helpers";

const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
  throw errorHandler(500);
}

const adapter = new PrismaNeon({
  connectionString: DATABASE_URL,
  // connectionString: process.env.DATABASE_LOCAL_URL!,
});

export const prisma = new PrismaClient({ adapter });
