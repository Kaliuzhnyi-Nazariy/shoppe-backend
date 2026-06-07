-- CreateEnum
CREATE TYPE "Categories" AS ENUM ('OTHER', 'ELECTRONICS', 'JEWELRY', 'HOME', 'BOOKS', 'GAMING', 'FOOD');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "categories" "Categories"[] DEFAULT ARRAY['OTHER']::"Categories"[];
